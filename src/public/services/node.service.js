import httpInstance from "@/shared/services/http.instance.js";
import { Node } from "@/public/model/node.entity.js";

const PROJECTS_PATH = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;
const NODES_PATH = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export class NodeService {

    /**
     * Helper privado para construir la URL base: /projects/{projectId}/nodes
     */
    _getNodesUrl(projectId) {
        return `/${PROJECTS_PATH}/${projectId}/${NODES_PATH}`;
    }

    // =========================================================
    // NODES
    // =========================================================

    async getNodesByProjectId(projectId) {
        const response = await httpInstance.get(this._getNodesUrl(projectId));
        return response.data.map(item => Node.fromResponse(item));
    }

    async getNodeById(projectId, nodeId) {
        const response = await httpInstance.get(`${this._getNodesUrl(projectId)}/${nodeId}`);
        return Node.fromResponse(response.data);
    }

    async getAllNodesByProjectId(projectId) {
        const response = await httpInstance.get(`${this._getNodesUrl(projectId)}`);
        return Node.fromResponse(response.data);
    }
};