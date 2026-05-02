import httpInstance from "@/shared/services/http.instance.js";

const BASE = import.meta.env.VITE_NODES_ENDPOINT_PATH;

export const nodeService = {

    async getNodeById(id) {
        const { data } = await httpInstance.get(`/${BASE}/${id}`);
        return data;
    },

    async getLinksByNodeId(nodeId) {
        const { data } = await httpInstance.get(`/${BASE}/${nodeId}/links`);
        return data;
    },

    async getAllNodes() {
        const { data } = await httpInstance.get(`/${BASE}`);
        return data;
    }
};