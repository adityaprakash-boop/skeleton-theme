export class KeyIngredients extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const ingredientItems = this.querySelectorAll('.ingredient-icon-item');
    const descTitle = this.querySelector('.ingredient-desc-title');
    if (!descTitle) return;
    ingredientItems.forEach((item) => {
      const title = item.querySelector('.ingredient-title');
      if (!title) return;
      const titleText = title.textContent.trim();
      item.addEventListener('click', () => {
        descTitle.textContent = titleText;
      });
    });
  }
}

if (!customElements.get('key-ingredients')) {
  customElements.define('key-ingredients', KeyIngredients);
}

