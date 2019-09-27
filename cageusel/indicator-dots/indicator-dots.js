const indicatorDotsDoc = document.currentScript.ownerDocument;

class IndicatorDots extends HTMLElement {
	static get observedAttributes() {
		return ['index'];
	}
	dots;

	constructor(length) {
		super();

		this.dots = new Array(length);
	}

	/*
	 * Called when element is inserted in DOM
	 */
	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: 'open' });

		// Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
		// Current document needs to be defined to get DOM access to imported HTML
		const template = indicatorDotsDoc.querySelector('#indicator-dots-template');
		const instance = template.content.cloneNode(true);
		shadowRoot.appendChild(instance);

		this.render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'index') {
			this.updateSelection(oldValue, newValue);
		}
	}

	render() {
		const ol = this.dotsOl;
		for (let index = 0; index < this.dots.length; index++) {
			const li = indicatorDotsDoc.createElement('li');
			const button = indicatorDotsDoc.createElement('button');
			button.type = 'button';

			button.tabIndex = index + 1;
			li.appendChild(button);

			if (!index) {
				this.select(button);
			} else {
				this.deselect(button);
			}
			li.addEventListener('click', () => document.dispatchEvent(new CustomEvent('selected', { detail: { index } })));
			ol.appendChild(li);
		}
	}

	updateSelection(oldValue, newValue) {
		const indicators = this.indicators;
		const current = oldValue === null ? indicators[0] : indicators[oldValue];
		const next = indicators[newValue];

		this.deselect(current);
		this.select(next);
	}

	select(dot) {
		dot.innerHTML = '🔴';
	}

	deselect(dot) {
		dot.innerHTML = '⭕';
	}

	get dotsOl() {
		return this.shadowRoot.querySelector('ol');
	}

	get indicators() {
		return this.shadowRoot.querySelectorAll('li button');
	}

	get index() {
		return parseInt(this.getAttribute('index'), 10);
	}
}

customElements.define('indicator-dots', IndicatorDots);
