import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';

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

            const [nodeData, linksData, markersData] = await Promise.all([
                nodeService.getNodeById(targetNodeId),
                nodeService.getLinksByNodeId(targetNodeId),
                markerService.getMarkersByNodeId(targetNodeId)
            ]);

            return {
                ...nodeData,
                links: linksData.map(link => ({
                    nodeId: String(link.to),
                    position: { textureX: link.textureX, textureY: link.textureY }
                })),
                markers: markersData.map(marker => ({
                    id: String(marker.id),
                    position: marker.position,
                    image: marker.image,
                    size: { width: 32, height: 32 },
                    anchor: 'bottom center',
                    tooltip: marker.tooltip
                }))
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
    const newMarkers = markersData.map(marker => ({
        id: String(marker.id),
        position: marker.position,
        image: marker.image,
        size: { width: 32, height: 32 },
        anchor: 'bottom center',
        tooltip: marker.tooltip
    }));

    markersPlugin.setMarkers(newMarkers);
}