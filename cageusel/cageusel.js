const currentDocument = document.currentScript.ownerDocument;

class Cageusel extends HTMLElement {
	cages = ['', 'g', 'c', 'gif', 'g'].sort(() => Math.random() - 0.5);
	images = [];
	index = 0;

	constructor() {
		super();

		this.images = this.cages.map(cage => {
			const insert = cage ? `${cage}/` : '';
			return {
				url: `https://www.placecage.com/${insert}500/300`,
				alt: 'Nicky Cage'
			};
		});
	}

	/*
	 * Called when element is inserted in DOM
	 */
	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: 'open' });

		// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
		// Current document needs to be defined to get DOM access to imported HTML
		const template = currentDocument.querySelector('#cageusel-template');
		const instance = template.content.cloneNode(true);
		shadowRoot.appendChild(instance);

		this.render();
	}

	render() {
		// Fill the respective areas of the card using DOM manipulation APIs
		// All of our components elements reside under shadow dom. So we created a this.shadowRoot property
		// We use this property to call selectors so that the DOM is searched only under this subtree
		const ul = this.shadowRoot.querySelector('ul');
		for (const img of this.images) {
			const slide = new Slide(img);

			ul.appendChild(slide);
		}
	}
}

customElements.define('cage-usel', Cageusel);
