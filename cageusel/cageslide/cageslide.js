const cageslideDoc = document.currentScript.ownerDocument;

class Slide extends HTMLElement {
	image;

	constructor(image) {
		super();
		this.image = image;
		console.log(this.image);
	}

	/*
	 * Called when element is inserted in DOM
	 */
	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: 'open' });

		// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
		// Current document needs to be defined to get DOM access to imported HTML
		const template = cageslideDoc.querySelector('#cageslide-template');
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

customElements.define('cage-slide', Slide);
