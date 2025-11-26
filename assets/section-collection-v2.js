class CollectionFilter extends HTMLElement {
    constructor() {
      super();
      this.sectionId = this.dataset.section;
    }
    connectedCallback() {
      this.bindFilterLinks();  
    }
    bindFilterLinks() {
      this.querySelectorAll("[data-filter-link]").forEach(link => {
        link.addEventListener("click", e => {
          e.preventDefault();
  
          const href = e.target.closest("a").href;
          const url = new URL(href, window.location.origin);
          const params = url.searchParams.toString();
  
          this.fetchSection(params);
        });
      });
    }
    updateClearButton(params) {
        const btn = this.querySelector(".clear-all-btn");
        if (params && params.length > 0) {
          btn.style.display = "inline-flex";
        } else {
          btn.style.display = "none";
        }
        btn.onclick = (e) => {
          e.preventDefault();
          this.fetchSection(""); 
        };
      }
      
    fetchSection(params) {
      const url = `${window.location.pathname}?section_id=${this.sectionId}&${params}`;
      fetch(url)
        .then(res => res.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          const newResults = doc.querySelector("#results-area");
          const currentResults = this.querySelector("#results-area");
  
          if (newResults && currentResults) {
            currentResults.innerHTML = newResults.innerHTML;
          }
          const newUrl = params ? `${window.location.pathname}?${params}` : window.location.pathname;
          history.replaceState({}, "", newUrl);
          this.bindFilterLinks();
          this.updateClearButton(params);
        })
        .catch(err => console.error("AJAX error:", err));
    }
  }
  if (!customElements.get("collection-v2")) {
    customElements.define("collection-v2", CollectionFilter);
  }
  