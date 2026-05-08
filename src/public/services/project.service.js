import httpInstance from "@/shared/services/http.instance.js";
import { ProjectSummaryResource } from "@/public/model/project-summary.resource.js";

const BASE = import.meta.env.VITE_PROJECTS_ENDPOINT_PATH;

export class ProjectService {
    /**
     * Obtiene la lista de todos los proyectos que han sido marcados como publicados.
     * Mapea al endpoint GET /api/v1/projects/published
     * @returns {Promise<ProjectSummaryResource[]>}
     */
    async getPublishedProjects() {
        try {
            const response = await httpInstance.get(`/${BASE}/published`);
            return response.data.map(item => new ProjectSummaryResource(item));
        } catch (error) {
            console.error("Error fetching published projects:", error);
            throw error;
        }
    }
}