import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';

import './CustomMarkerElement';
import { nodeService } from './node.service';
import { markerService } from './marker.service';

import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '@photo-sphere-viewer/gallery-plugin/index.css';

/** @type {Viewer|null} */
let currentViewer = null;

const getPluginsConfig = (startNodeId) => [
    MarkersPlugin,
    [VirtualTourPlugin, {
        dataMode: 'server',
        startNodeId: startNodeId,
        getNode: async (nodeId) => {
            const targetNodeId = String(nodeId);

            const [nodeData, linksData] = await Promise.all([
                nodeService.getNodeById(targetNodeId),
                nodeService.getLinksByNodeId(targetNodeId),
            ]);

            return {
                ...nodeData,
                links: linksData.map(link => ({
                    nodeId: String(link.to),
                    position: { textureX: link.textureX, textureY: link.textureY }
                })),
                // DEJAMOS ESTO VACÍO: Evita el error "missing marker content"
                // Nuestra función refreshMarkers se encargará de pintarlos después
                markers: []
            };
        }
    }],
    [AutorotatePlugin, {
        autostartDelay: 2000,
        autostartOnIdle: true,
        autorotateSpeed: '1rpm',
        autorotatePitch: '0deg',
    }],
    [GalleryPlugin, {
        visibleOnLoad: false,
        hideOnClick: true,
    }]
];

export function createViewer(container, startNodeId) {
    const viewer = new Viewer({
        container,
        panorama: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        plugins: getPluginsConfig(startNodeId)
    });

    loadGalleryItems(viewer).catch(err => console.error("Init error:", err));
    currentViewer = viewer;
    return viewer;
}

export function toggleGallery(viewer) {
    const instance = viewer || currentViewer;
    if (instance) {
        /** @type {GalleryPlugin} */
        const gallery = instance.getPlugin(GalleryPlugin);
        if (gallery) gallery.toggle();
    }
}

/**
 * Fetches all nodes and populates the Gallery Plugin.
 * @param {Viewer} viewer
 */
async function loadGalleryItems(viewer) {
    const nodes = await nodeService.getAllNodes();
    const gallery = viewer.getPlugin(GalleryPlugin);
    const virtualTour = viewer.getPlugin(VirtualTourPlugin);

    const galleryItems = nodes.map(node => ({
        id: String(node.id),
        name: node.caption,
        thumbnail: node.thumbnail,
        panorama: node.panorama,
        options: { caption: node.caption }
    }));

    if (gallery && virtualTour) {
        gallery.setItems(galleryItems);

        let isTourReady = !!virtualTour.currentNode;

        const setTourAsReady = (nodeId) => {
            isTourReady = true;
            refreshMarkers(viewer, nodeId);
        };

        virtualTour.addEventListener('ready', () => setTourAsReady(virtualTour.currentNode?.id));
        virtualTour.addEventListener('node-changed', ({ node }) => setTourAsReady(node.id));

        const safeNavigate = async (itemId) => {
            const targetId = String(itemId);

            if (virtualTour.currentNode?.id === targetId) return;

            if (!isTourReady) {
                setTimeout(() => safeNavigate(targetId), 500);
                return;
            }

            try {
                isTourReady = false;
                await handleGalleryNavigation(viewer, targetId);
            } catch (err) {
                isTourReady = true;
            }
        };

        gallery.addEventListener('select-item', ({ itemId }) => safeNavigate(itemId));

        viewer.container.addEventListener('click', (event) => {
            const item = event.target.closest('.psv-gallery-item');
            if (item) safeNavigate(item.dataset.psvGalleryItem);
        }, true);

        if (virtualTour.currentNode) setTourAsReady(virtualTour.currentNode.id);
    }
}

/**
 * Logic to execute when a gallery item is picked
 */
async function handleGalleryNavigation(viewer, itemId) {
    const virtualTour = viewer.getPlugin(VirtualTourPlugin);
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    const stringId = String(itemId);

    if (markersPlugin) {
        markersPlugin.clearMarkers();
    }

    await virtualTour.setCurrentNode(stringId, { transition: false });

    try {
        await virtualTour.setCurrentNode(stringId);

        viewer.needsUpdate();

    } catch (error) {
        throw error;
    }
}

async function refreshMarkers(viewer, nodeId) {
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    if (!markersPlugin) return;

    const markersData = await markerService.getMarkersByNodeId(nodeId);

    const newMarkers = markersData.map(marker => {
        if (marker.type === 'info') {
            const el = document.createElement('custom-marker');
            el.innerHTML = `<h3>${marker.title}</h3><p>${marker.content}</p>`;
            return {
                id: String(marker.id),
                position: marker.position,
                element: el,
                anchor: 'bottom center',
                data: { type: 'info' }
            };
        }

        if (marker.type === 'detail') {
            return {
                id: String(marker.id),
                position: marker.position,
                image: '/pin.png',
                size: { width: 40, height: 40 },
                anchor: 'bottom center',
                tooltip: marker.tooltip,
                data: { type: 'detail', payload: marker }
            };
        }

        return {
            id: String(marker.id),
            position: marker.position,
            image: '/pin.png',
            size: { width: 32, height: 32 },
            anchor: 'bottom center'
        };
    });

    markersPlugin.setMarkers(newMarkers);
}

export function initMarkerEvents(viewer, callback) {
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    markersPlugin.addEventListener('select-marker', ({ marker }) => {
        if (marker.data?.type === 'detail') {
            callback(marker.data.payload);
        }
    });
}