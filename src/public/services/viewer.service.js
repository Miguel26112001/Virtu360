import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';

import { NodeService } from './node.service';
import { MarkerService } from './marker.service';
import { LinkService } from './link.service';

import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '@photo-sphere-viewer/gallery-plugin/index.css';

const nodeService = new NodeService();
const markerService = new MarkerService();
const linkService = new LinkService();

/** @type {Viewer|null} */
let currentViewer = null;

const getPluginsConfig = (projectId, startNodeId) => [
    MarkersPlugin,
    GyroscopePlugin,
    [VirtualTourPlugin, {
        dataMode: 'server',
        startNodeId: startNodeId ? String(startNodeId) : null,
        getNode: async (nodeId) => {
            if (!nodeId || nodeId === 'undefined') {
                console.warn("VirtualTour intentó cargar un nodo undefined. Abortando petición.");
                return null;
            }

            const targetNodeId = String(nodeId);

            const [nodeData, linksData] = await Promise.all([
                nodeService.getNodeById(projectId, targetNodeId),
                linkService.getLinksByNodeId(projectId, targetNodeId),
            ]);

            console.log("Datos del nodo recibidos:", nodeData);

            return {
                id: nodeData.id,
                panorama: nodeData.panoramaUrl,
                thumbnail: nodeData.thumbnailUrl,
                name: nodeData.caption,
                links: linksData.map(link => ({
                    nodeId: String(link.toNodeId),
                    position: {
                        yaw: link.yaw,
                        pitch: link.pitch
                    }
                }))
            };
        }
    }],
    [AutorotatePlugin, {
        autostartDelay: 2000,
        autostartOnIdle: true,
        autorotateSpeed: '1rpm'
    }],
    [GalleryPlugin, {
        visibleOnLoad: false,
        hideOnClick: true,
    }]
];

export function createViewer(container, projectId, startNodeId) {
    const viewer = new Viewer({
        container,
        panorama: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        plugins: getPluginsConfig(projectId, startNodeId)
    });

    const virtualTour = viewer.getPlugin(VirtualTourPlugin);

    virtualTour.addEventListener('node-changed', ({ node }) => {
        if (node?.id) {
            console.log("Nodo cambiado, refrescando markers para:", node.id);
            refreshMarkers(viewer, projectId, node.id);

            const gallery = viewer.getPlugin(GalleryPlugin);
            if (gallery) {
                gallery.currentId = node.id;
            }
        }
    });

    loadGalleryItems(viewer, projectId).catch(err => console.error("Init error:", err));

    currentViewer = viewer;
    return viewer;
}

/**
 * Fetches all nodes and populates the Gallery Plugin.
 * @param {Viewer} viewer
 * @param {string} projectId
 */
async function loadGalleryItems(viewer, projectId) {
    const nodes = await nodeService.getNodesByProjectId(projectId);
    const gallery = viewer.getPlugin(GalleryPlugin);
    const virtualTour = viewer.getPlugin(VirtualTourPlugin);

    if (!gallery || !virtualTour) return;

    const galleryItems = nodes.map(node => ({
        id: String(node.id),
        name: node.caption,
        thumbnail: node.thumbnailUrl,
        panorama: node.panoramaUrl,
        options: { caption: node.caption }
    }));

    const galleryHandler = (itemId) => {
        const targetId = String(itemId);

        console.log("Gallery Handler ejecutado para nodo:", targetId);

        if (virtualTour.currentNode?.id !== targetId) {
            virtualTour.setCurrentNode(targetId).catch(err => {
                if (err.name !== 'AbortError') console.error("Error en navegación:", err);
            });
        }

        gallery.hide();
    };

    gallery.setItems(galleryItems, galleryHandler);
}

async function refreshMarkers(viewer, projectId, nodeId) {
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    if (!markersPlugin) return;

    markersPlugin.clearMarkers();
    const markersData = await markerService.getMarkersByNodeId(projectId, nodeId);

    const newMarkers = markersData.map(marker => {
        const baseConfig = {
            id: String(marker.id),
            position: marker.position,
            tooltip: marker.tooltip || marker.title,
            size: { width: 32, height: 32 },
            anchor: 'bottom center',
            data: { payload: marker }
        };

        switch (marker.type) {
            case 'INFO':
                return {
                    ...baseConfig,
                    image: 'https://img.icons8.com/color/48/info.png',
                    size: { width: 32, height: 32 }
                };
            case 'VIDEO':
                return {
                    ...baseConfig,
                    image: 'https://img.icons8.com/color/48/video.png',
                    size: { width: 40, height: 40 }
                };
            default:
                return {
                    ...baseConfig,
                    image: 'https://img.icons8.com/color/48/marker.png',
                    size: { width: 32, height: 32 }
                };
        }
    });

    markersPlugin.setMarkers(newMarkers);
}

/**
 * Inicializa los eventos de clic en marcadores para que la UI de Vue pueda reaccionar
 */
export function initMarkerEvents(viewer, callback) {
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    if (!markersPlugin) return;

    markersPlugin.addEventListener('select-marker', ({ marker }) => {
        if (marker.data?.payload) {
            callback(marker.data.payload);
        }
    });
}

export function toggleGallery(viewer) {
    const instance = viewer || currentViewer;
    if (instance) {
        /** @type {GalleryPlugin} */
        const gallery = instance.getPlugin(GalleryPlugin);
        if (gallery) gallery.toggle();
    }
}