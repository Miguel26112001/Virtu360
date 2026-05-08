/**
 * Representa un enlace entre dos nodos (LinkResource).
 */
export class Link {
    constructor(id = '', fromNodeId = '', toNodeId = '', yaw = 0, pitch = 0) {
        this.id = id;
        this.fromNodeId = fromNodeId;
        this.toNodeId = toNodeId;
        this.yaw = yaw;
        this.pitch = pitch;
    }

    /**
     * Crea una instancia de Link a partir de la respuesta del API.
     */
    static fromResponse(response) {
        return new Link(
            response.id,
            response.fromNodeId,
            response.toNodeId,
            response.yaw,
            response.pitch
        );
    }
}