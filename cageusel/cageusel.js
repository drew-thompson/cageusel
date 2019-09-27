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
		} else {
			this.swapActionButton();
		}

		this.render();
	}

	/**
	 * Fill the respective areas of the cageusel using DOM manipulation APIs.
	 * All of our components elements reside under shadow dom. So we created a this.shadowRoot property.
	 * We use this property to call selectors so that the DOM is searched only under this subtree.
	 */
	render() {
		const ul = this.getEl('ul');
		for (let i = 0; i < this.images.length; i++) {
			const img = this.images[i];
			const li = currentDocument.createElement('li');
			const slide = new CageSlide(img);

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

	onNavigated(forward) {
		if (forward) {
			this.next();
		} else {
			this.prev();
		}
		if (this.isPlaying) {
			this.pause();
		}
	}

	swapSlidesAtIndices(prev, next) {
		const items = this.getItems();
		const prevLi = this.getItem(prev, items);
		const nextLi = this.getItem(next, items);

		this.hide(prevLi);
		this.show(nextLi);
	}

	swapActionButton() {
		const hide = this.isPlaying ? this.playButton : this.pauseButton;
		const show = this.isPlaying ? this.pauseButton : this.playButton;
		this.hide(hide);
		this.show(show);
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
			this.swapActionButton();
		}
	}

	pause() {
		if (this.isPlaying) {
			if (this.intervalId !== null) {
				clearInterval(this.intervalId);
			}
			this.isPlaying = false;
			this.swapActionButton();
		}
	}

	assignActionListeners() {
		this.nextButton.addEventListener('click', () => this.onNavigated(true));
		this.prevButton.addEventListener('click', () => this.onNavigated(false));

		this.playButton.addEventListener('click', () => this.play());
		this.pauseButton.addEventListener('click', () => this.pause());
	}

	get pauseButton() {
		return this.getEl('#pause');
	}

	get playButton() {
		return this.getEl('#play');
	}

	get nextButton() {
		return this.getEl('#next');
	}

	get prevButton() {
		return this.getEl('#prev');
	}

	getEl(selector) {
		return this.shadowRoot.querySelector(selector);
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
