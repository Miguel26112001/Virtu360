export class CustomMarkerElement extends HTMLElement {
    constructor() {
        super();
        this.fmt = new Intl.NumberFormat({ maximumSignificantDigits: 4 });
        const dom = this.attachShadow({ mode: 'closed' });

        const style = document.createElement('style');
        style.innerText = `
            :host { display: block; position: relative; width: 50px; height: 50px; }
            button { 
                width: 100%; height: 100%; padding: 0; border: none; 
                background: none; color: #61aaf2; cursor: pointer;
            }
            .tooltip { 
                box-sizing: border-box; width: 250px; position: absolute; 
                bottom: calc(100% + 10px); left: calc(50% - 125px); 
                background: rgba(30, 30, 30, 0.9); color: white; padding: 15px;
                border-radius: 8px; opacity: 0; pointer-events: none; 
                transition: all 0.3s ease; transform: translateY(10px);
                z-index: 10;
            }
            button:hover + .tooltip { opacity: 1; transform: translateY(0); }
            .tooltip.bottom { bottom: auto; top: calc(100% + 10px); }
            h3 { margin: 0 0 5px 0; color: #61aaf2; font-size: 16px; }
            p { margin: 0; font-size: 14px; line-height: 1.4; }
        `;
        dom.appendChild(style);

        const button = document.createElement('button');
        button.innerHTML = `
            <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="25" fill="currentColor"/>
                <circle cx="50" cy="50" r="40" stroke-width="10" fill="none" stroke="currentColor"/>
            </svg>`;
        dom.appendChild(button);

        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('tooltip');
        this.tooltip.innerHTML = '<slot></slot>';
        dom.appendChild(this.tooltip);
    }

    // El visor llama a esta función automáticamente al mover la cámara
    updateMarker({ position, viewerSize }) {
        this.tooltip.classList.toggle('bottom', position.y < viewerSize.height / 3);
    }
}

// Registrar el elemento para que el navegador lo reconozca
if (!customElements.get('custom-marker')) {
    customElements.define('custom-marker', CustomMarkerElement);
}