const template = document.createElement('template');

template.id = 'cageslide-template';
template.innerHTML = `<link rel="stylesheet" href="resources/css/cageslide.css">
<img src="" alt="">`;

export class CageSlide extends HTMLElement {
	image;

	constructor(image) {
		super();
		this.image = image;
	}

	/*
	 * Called when element is inserted in DOM
	 */
	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: 'open' });

		// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
		// Current document needs to be defined to get DOM access to imported HTML
		const instance = template.content.cloneNode(true);
		shadowRoot.appendChild(instance);

		this.render();
	}

	render() {
		const img = this.shadowRoot.querySelector('img');
		img.src = this.image.url;
		img.alt = this.image.alt;
	}
}

customElements.define('cage-slide', CageSlide);
