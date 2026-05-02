import httpInstance from "@/shared/services/http.instance.js";

const BASE = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export const markerService = {

    async getMarkersByNodeId(nodeId) {
        const { data } = await httpInstance.get(`/${BASE}/${nodeId}/markers`);
        return data;
    }
};