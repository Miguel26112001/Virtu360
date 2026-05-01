import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const nodeService = {
    async getNodeById(id) {
        const { data } = await axios.get(`${API_URL}/nodes/${id}`);
        return data;
    },

    async getLinksByNodeId(nodeId) {
        const { data } = await axios.get(`${API_URL}/links?from=${nodeId}`);
        return data;
    },

    async getAllNodes() {
        const { data } = await axios.get(`${API_URL}/nodes`);
        return data;
    }
};