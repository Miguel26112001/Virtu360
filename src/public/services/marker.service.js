import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const markerService = {
    async getMarkersByNodeId(nodeId) {
        const { data } = await axios.get(`${API_URL}/markers?nodeId=${nodeId}`);
        return data;
    }
};