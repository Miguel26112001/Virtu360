import httpInstance from "@/shared/services/http.instance.js";
import { Link } from "@/public/model/link.entity.js";

const PROJECTS_PATH = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;
const NODES_PATH = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export class LinkService {
    /**
     * Helper privado para construir la URL base: /projects/{projectId}/nodes
     */
    _getLinksUrl(projectId, nodeId) {
        return `/${PROJECTS_PATH}/${projectId}/${NODES_PATH}/${nodeId}`;
    }

    // =========================================================
    // LINKS
    // =========================================================

    async getLinksByNodeId(projectId, nodeId) {
        const response = await httpInstance.get(`${this._getLinksUrl(projectId, nodeId)}/links`);
        return response.data.map(item => Link.fromResponse(item));
    }
}