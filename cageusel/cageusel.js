const currentDocument = document.currentScript.ownerDocument;

class Cageusel extends HTMLElement {
	cages = ['', 'g', 'c', 'gif', 'g'].sort(() => Math.random() - 0.5);
	images = [];
	index = 0;
	intervalId;
	isPlaying;

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

		this.assignActionListeners();

		if (this.autoplay) {
			this.play();
		}

		this.render();
	}

	/**
	 * Fill the respective areas of the cageusel using DOM manipulation APIs.
	 * All of our components elements reside under shadow dom. So we created a this.shadowRoot property.
	 * We use this property to call selectors so that the DOM is searched only under this subtree.
	 */
	render() {
		const ul = this.shadowRoot.querySelector('ul');
		for (let i = 0; i < this.images.length; i++) {
			const img = this.images[i];
			const li = currentDocument.createElement('li');
			const slide = new Slide(img);

			li.appendChild(slide);
			if (i) {
				this.hide(li);
			}

			ul.appendChild(li);
		}
	}

	next() {
		const current = this.index;
		const len = this.images.length;
		const isWrappingRight = this.index === len - 1;
		if (!isWrappingRight) {
			this.index++;
		} else {
			this.index = 0;
		}
		this.swapSlidesAtIndices(current, this.index);
	}

	prev() {
		const current = this.index;
		const len = this.images.length;
		const isWrappingLeft = !this.index;
		if (!isWrappingLeft) {
			this.index--;
		} else {
			this.index = len - 1;
		}
		this.swapSlidesAtIndices(current, this.index);
	}

	swapSlidesAtIndices(prev, next) {
		const items = this.getItems();
		const prevLi = this.getItem(prev, items);
		const nextLi = this.getItem(next, items);

		this.hide(prevLi);
		this.show(nextLi);
	}

	hide(item) {
		item.style.display = 'none';
	}

	show(item) {
		item.style.display = 'initial';
	}

	getItems() {
		return this.shadowRoot.querySelectorAll('ul li');
	}

	getItem(index, items = this.getItems()) {
		return items[index];
	}

	play() {
		if (!this.isPlaying) {
			this.intervalId = setInterval(() => {
				this.next();
			}, this.period || 5000);
			this.isPlaying = true;
		}
	}

	pause() {
		if (this.isPlaying) {
			if (this.intervalId !== null) {
				clearInterval(this.intervalId);
			}
			this.isPlaying = false;
		}
	}

	assignActionListeners() {
		const next = this.shadowRoot.querySelector('#next');
		next.addEventListener('click', () => this.next());

		const prev = this.shadowRoot.querySelector('#prev');
		prev.addEventListener('click', () => this.prev());

		const play = this.shadowRoot.querySelector('#play');
		play.addEventListener('click', () => this.play());

		const pause = this.shadowRoot.querySelector('#pause');
		pause.addEventListener('click', () => this.pause());
	}

	get autoplay() {
		const autoplay = this.getAttribute('autoplay');
		return autoplay !== null && autoplay !== 'false';
	}

	get period() {
		const period = this.getAttribute('period');
		return parseInt(period, 10);
	}
}

customElements.define('cage-usel', Cageusel);
