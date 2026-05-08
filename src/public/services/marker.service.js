import httpInstance from "@/shared/services/http.instance.js";
import { Marker } from "@/public/model/marker.entity.js";

const PROJECTS_PATH = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;
const NODES_PATH = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export class MarkerService {
    /**
     * Helper privado para construir la base: /api/v1/projects/{projectId}/nodes/{nodeId}
     */
    _getMarkersBaseUrl(projectId, nodeId) {
        if (!nodeId || nodeId === 'undefined') {
            throw new Error(`MarkerService: Se requiere un nodeId válido, se recibió: ${nodeId}`);
        }
        return `/${PROJECTS_PATH}/${projectId}/${NODES_PATH}/${nodeId}`;
    }

    /**
     * Obtiene todos los marcadores de un nodo (usando el endpoint genérico)
     */
    async getMarkersByNodeId(projectId, nodeId) {
        const response = await httpInstance.get(`${this._getMarkersBaseUrl(projectId, nodeId)}/markers`);
        return response.data.map(item => Marker.fromResponse(item));
    }
}