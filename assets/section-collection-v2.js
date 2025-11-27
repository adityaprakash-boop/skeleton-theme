class CollectionFilter extends HTMLElement {
  constructor() {
    super();
    this.sectionId = this.dataset.section;
  }

  connectedCallback() {
    this.bindFilterLinks();
    this.bindSortLinks();
  }


  bindFilterLinks() {
    this.querySelectorAll("[data-filter-link]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        const label = link.querySelector(".filter-value-1").innerText;
        this.querySelector(".active-filter-text span").innerText = label;
        this.querySelector(".active-filter-bar").style.display = "inline-flex";

        const href = e.target.closest("a").href;
        const url = new URL(href, window.location.origin);
        const params = url.searchParams.toString();

        this.fetchSection(params);
      });
    });
  }


  bindSortLinks() {
    this.querySelectorAll("[data-sort-link]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();

        const href = link.href;
        const url = new URL(href, window.location.origin);
        const params = url.searchParams.toString();

        this.fetchSection(params);
      });
    });
  }

  updateClearButton(params) {
    const activeNav = this.querySelector(".active-filter-bar");
    activeNav.style.display = params && params.length > 0 ? "inline-flex" : "none";

    activeNav.onclick = (e) => {
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
        this.bindSortLinks();
        this.updateClearButton(params);
      })
      .catch(err => console.error("AJAX error:", err));
  }
}

if (!customElements.get("collection-v2")) {
  customElements.define("collection-v2", CollectionFilter);
}
