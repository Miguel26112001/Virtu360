export class Marker {
    constructor(id, nodeId, type, position, tooltip, title, summary, data = {}) {
        this.id = id;
        this.nodeId = nodeId;
        this.type = type;
        this.position = position;
        this.tooltip = tooltip;
        this.title = title;
        this.summary = summary;

        Object.assign(this, data);
    }

    static fromResponse(response) {
        const {
            id, nodeId, type, position, tooltip, title, summary,
            content, description, videoUrl, youtube, imageUrls
        } = response;

        let specificData = {};

        switch (type) {
            case 'INFO':
                specificData = { content, description };
                break;
            case 'VIDEO':
                specificData = { videoUrl, youtube };
                break;
            case 'GALLERY':
                specificData = { imageUrls: imageUrls || [] };
                break;
        }

        return new Marker(id, nodeId, type, position, tooltip, title, summary, specificData);
    }
}