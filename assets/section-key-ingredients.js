export class KeyIngredients extends HTMLElement {
  connectedCallback() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const descTitle = this.querySelector('.ingredient-desc-title');
    const iconsWrapper = this.querySelector('.ingredient-icons');
    iconsWrapper.addEventListener('click', (e) => {
      const item = e.target.closest('.ingredient-icon-item');
      const title = item.dataset.title;
      descTitle.textContent = title;
    });
  }
}

if (!customElements.get('key-ingredients')) {
  customElements.define('key-ingredients', KeyIngredients);
}
