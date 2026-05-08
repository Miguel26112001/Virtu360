/**
 * Represents a summary of a project.
 * Matches the ProjectSummaryResource.java from the backend.
 */
export class ProjectSummaryResource {
    /**
     * @param {string} id - UUID of the project
     * @param {string} title - Title of the project
     * @param {string} description - Project description
     * @param {boolean} published - Publication status
     * @param {number} totalNodes - Count of nodes in the project
     * @param {string} startingNodeId - UUID of the starting node
     */
    constructor({
                    id = '',
                    title = '',
                    description = '',
                    published = false,
                    totalNodes = 0,
                    startingNodeId = ''
                } = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.published = published;
        this.totalNodes = totalNodes;
        this.startingNodeId = startingNodeId;
    }
}