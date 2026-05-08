/**
 * Representa el recurso NodeResource del backend.
 */
export class Node {
    /**
     * @param {string} id - UUID del nodo
     * @param {string} panoramaUrl - URL de la imagen equirectangular
     * @param {string} thumbnailUrl - URL de la miniatura
     * @param {string} caption - Título o descripción corta del nodo
     */
    constructor({ id = '', panoramaUrl = '', thumbnailUrl = '', caption = '' } = {}) {
        this.id = id;
        this.panoramaUrl = panoramaUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.caption = caption;
    }

    /**
     * Helper para transformar la respuesta de la API
     */
    static fromResponse(data) {
        return new Node(data);
    }
}