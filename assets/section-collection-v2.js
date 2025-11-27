class CollectionFilter extends HTMLElement {
  constructor() {
    super();
    this.sectionId = this.dataset.section;
  }

  connectedCallback() {
    this.form = document.querySelector("#custom-filter-form");
    this.bindInputs();
    this.bindSortLinks();
    this.bindClearAll();
  }
  bindClearAll() {
    const btn = this.querySelector(".clear-all-btn");
    btn.addEventListener("click", e => {
      e.preventDefault();
      document
        .querySelectorAll("#custom-filter-form input[type='checkbox']")
        .forEach(checkbox => (checkbox.checked = false));
      this.onFormChange();
    });
  }
  
  bindInputs() {
    document
      .querySelectorAll("#custom-filter-form [data-filter-input]")
      .forEach(input => {
        input.addEventListener("change", () => this.onFormChange());
      });
  }
  bindSortLinks() {
    this.querySelectorAll("[data-sort-link]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const url = new URL(link.href, window.location.origin);
        this.fetchSection(url.searchParams.toString());
      });
    });
  }
  onFormChange() {
    if (!this.form) return;
    const formData = new FormData(this.form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }
    this.fetchSection(params.toString());
  }
  fetchSection(params) {
    const url =
      `${window.location.pathname}?section_id=${this.sectionId}` + (params ? `&${params}` : "");
      fetch(url)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const newResults = doc.querySelector("#results-area");
        const currentResults = this.querySelector("#results-area");

        if (newResults && currentResults) {
          currentResults.innerHTML = newResults.innerHTML;
        }

        const newUrl = params ? `${window.location.pathname}?${params}`: window.location.pathname;
        history.replaceState({}, "", newUrl);
        this.bindInputs();
        this.bindSortLinks();
        
      })
      .catch(err => console.error("AJAX ERROR:", err));
  }
}

if (!customElements.get("collection-v2")) {
  customElements.define("collection-v2", CollectionFilter);
}
