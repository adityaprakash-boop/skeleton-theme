import { debounce } from './theme.js';

class CollectionV2 extends HTMLElement {
  constructor() {
    super();
    this.debounceOnChange = debounce((event) => this.onFormChange(event), 800);
    this.sectionId = this.dataset.section;
    this.addEventListener("change", this.onFormChange.bind(this));
    this.addEventListener('click', this.onClickHandler.bind(this));
    this.form = document.querySelector("#custom-filter-form");
  }

  onClickHandler = (event) => {
    const target = event.target.closest('[data-render-section-url]');
    if (target) {
      event.preventDefault();
      const searchParams = new URLSearchParams(target.dataset.renderSectionUrl.split('?')[1]).toString();
    this.fetchSection(searchParams);
    }
  };

  onFormChange(event) {
    if (!event.target.matches('[data-render-section]')) return;
    if (!this.form) return;
    const formData = new FormData(this.form);
    const params = new URLSearchParams(formData);
    this.fetchSection(params.toString());
  }

  updateSourceFromDestination(html, id) {
    const source = html.getElementById(id);
    const destination = this.querySelector(`#${id}`);
    if (source && destination){
      destination.innerHTML = source.innerHTML;
    } 
  }

  fetchSection(params) {
    const url =`${window.location.pathname}?section_id=${this.sectionId}` + (params ? `&${params}` : "");
  
    fetch(url)
      .then((res) => res.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
  
        this.updateSourceFromDestination(html, `filters-wrapper-${this.sectionId}`);
        this.updateSourceFromDestination(html, `active-filter-bar-${this.sectionId}`);
        this.updateSourceFromDestination(html, `results-area`);
  
        this.form = this.querySelector("#custom-filter-form");
        const newUrl = params? `${window.location.pathname}?${params}`: window.location.pathname;
        history.replaceState({}, "", newUrl);
      })
      .catch((err) => console.error("AJAX ERROR:", err));
  }
  
}
if (!customElements.get("collection-v2")) {
  customElements.define("collection-v2", CollectionV2);
}
