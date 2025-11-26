export class NewsletterSection extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      const checkbox = this.querySelector('.nl-checkbox');
      const button = this.querySelector('.nl-btn-primary');
      button.disabled = !checkbox.checked;
      checkbox.addEventListener('change', () => {
        button.disabled = !checkbox.checked;
      });
    }
  }
  
  if (!customElements.get('newsletter-section')) {
    customElements.define('newsletter-section', NewsletterSection);
  }
  