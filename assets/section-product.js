export class ProductInfo extends HTMLElement {
  abortController = undefined;

  constructor() {
    super();
  }
  setupEventListeners() {
    this.variantSelector?.addEventListener('change', this.onVariantChange.bind(this));
    this.quantitySelector.addEventListener('change', this.onQuantitySelectorEvent.bind(this));
    this.quantitySelector.querySelector('button[name="plus"]').addEventListener('click', this.onQuantitySelectorEvent.bind(this));
    this.quantitySelector.querySelector('button[name="minus"]').addEventListener('click', this.onQuantitySelectorEvent.bind(this));
    document.getElementById('swiper-script').addEventListener('load', this.initSwiper.bind(this));
    // Bug: Image preview update disabled - image won't change when variant changes
    this.variantSelector?.addEventListener('change', () => {
      this.updateVariantImage();
      this.updateAddToCartButton();
    });
    this.bindThumbnailClicks();
  }

  connectedCallback() {
    this.setupEventListeners();
    if (typeof Swiper !== 'undefined') {
      this.initSwiper();
    }
    // Initialize add to cart button state on load
    this.updateAddToCartButton();
    // Ensure first variant ID is set on load
    this.updateVariantInputs();
  }

  initSwiper() {
    this.swiper = new Swiper('.swiper', {
      autoHeight: true,
      direction: 'horizontal',
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      },
    });
  }

  bindThumbnailClicks() {
    const thumbs = this.querySelectorAll('.product-thumbnail-strip .thumb');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.index, 10);
        if (this.swiper && !isNaN(index)) {
          this.swiper.slideTo(index);
        }
      });
    });
  }

  updateVariantImage() {
    const selectedOption = this.variantSelector.selectedOptions[0];
    // Skip image update if 2nd variant is selected
    if (selectedOption?.dataset.disableImageUpdate === 'true') {
      return;
    }
    
    const mediaId = selectedOption?.dataset.mediaId;
    const preview = this.querySelector('#VariantImagePreview img');
    if (!preview || !mediaId) return;

    const target = this.querySelector(`.swiper-slide[data-media-id="${mediaId}"] img`);
    if (target)
      preview.src = target.src;
  }


  // get variantSelector() {
  //   return this.querySelector('variant-selector');
  // }
  get variantSelector() {
    return this.querySelector('#CombinedVariantSelector');
  }

  get quantitySelector() {
    return this.querySelector('quantity-selector');
  }

  // get selectedOptionValues() {
  //   if (this.variantSelector.dataset.pickerType === 'dropdown') {
  //     const list = Array.from(this.variantSelector.querySelectorAll('select')).map(
  //       (select) => select.options[select.selectedIndex].dataset.optionValueId
  //     );
  //     return list;
  //   } else {
  //     const list = Array.from(this.variantSelector.querySelectorAll('fieldset input:checked')).map(
  //       ({ dataset }) => dataset.optionValueId
  //     );
  //     return list;
  //   }
  // }
  get selectedOptionValues() {
    return [this.variantSelector.value];
  }


  getSelectedVariant(html) {
    const selectedVariant = html.querySelector('[data-selected-variant]')?.innerHTML;
    return !!selectedVariant ? JSON.parse(selectedVariant) : null;
  }

  onVariantChange(e) {
    const hasDifferentProductUrl = e.target?.dataset?.productUrl ? (e.target?.dataset?.productUrl !== this.dataset.url) : false;
    const productUrl = e.target?.dataset?.productUrl || this.dataset.url;
    this.renderSection(hasDifferentProductUrl, productUrl);
  }
  
  onQuantitySelectorEvent(e) {
    const quantityInput = this.quantitySelector.querySelector('input[type="number"]');
    let currentValue = parseInt(quantityInput.value);
    const minValue = parseInt(quantityInput.getAttribute('min')) || 0;
    const maxValue = parseInt(quantityInput.getAttribute('max')) || Infinity;

    if (e.target.name === 'minus' && currentValue > minValue) {
      quantityInput.value = currentValue - 1;
    } else if (e.target.name === 'plus' && currentValue < maxValue) {
      quantityInput.value = currentValue + 1;
    } else if (e.type === 'change') {
      if (currentValue < minValue) {
        quantityInput.value = minValue;
      } else if (currentValue > maxValue) {
        quantityInput.value = maxValue;
      }
    }
  }

  updateMedia(variantFeaturedMediaId) {
    if (!variantFeaturedMediaId) return;
    
    // Skip media update if 2nd variant is selected
    const selectedOption = this.variantSelector?.selectedOptions[0];
    if (selectedOption?.dataset.disableImageUpdate === 'true') {
      return;
    }
    
    var index = this.querySelector(`.swiper-slide[data-media-id="${variantFeaturedMediaId}"]`).dataset.mediaIndex;
    this.swiper?.slideTo(index);
  }

  updateURL(variantId) {
    // this.querySelector('share-button')?.updateUrl(
    //   `${window.shopUrl}${url}${variantId ? `?variant=${variantId}` : ''}`
    // );
    if (!window.location.pathname.includes('/products/')) return;
    window.history.replaceState({}, '', `${this.dataset.url}${variantId ? `?variant=${variantId}` : ''}`);
  }

  updateSourceFromDestination = (html, id) => {
    const source = html.getElementById(`${id}`);
    const destination = this.querySelector(`#${id}`);
    if (source && destination) {
      destination.innerHTML = source.innerHTML;
      // After updating, ensure the first variant ID is set in the form
      if (id.includes('add-to-cart-container')) {
        this.updateVariantInputs();
      }
    }
  };

  updateVariantInputs(variantId) {
    // Always use the first variant ID for cart submission
    const firstVariantInput = this.querySelector('input[name="id"][data-first-variant-id]');
    const firstVariantId = firstVariantInput?.dataset.firstVariantId || firstVariantInput?.value;
    
    this.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`).forEach(
      (productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        // Always set to first variant ID, regardless of selected variant
        input.value = firstVariantId ?? '';
      }
    );
  }

  updateAddToCartButton() {
    const selectedOption = this.variantSelector?.selectedOptions[0];
    const addToCartButton = this.querySelector(`#AddToCart-${this.dataset.section}`);
    
    if (!addToCartButton) return;
    
    // Disable button if 2nd variant is selected
    if (selectedOption?.dataset.disableAddToCart === 'true') {
      addToCartButton.disabled = true;
    } else {
      // Re-enable if variant is available
      const variantId = this.variantSelector.value;
      const variant = JSON.parse(this.querySelector('[data-selected-variant]')?.textContent || '{}');
      if (variant && variant.available !== false) {
        addToCartButton.disabled = false;
      }
    }
  }

  renderSection(hasDifferentProductUrl, productUrl) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    fetch(`${productUrl}?variant=${this.variantSelector.value}&section_id=${this.dataset.section}`, {
      signal: this.abortController.signal,
    })
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const variant = this.getSelectedVariant(html);
        if (hasDifferentProductUrl) {
          const productInfo = html.querySelector('product-info');
          this.replaceWith(productInfo);
          productInfo.updateURL(variant?.id);
        } else {
          this.updateMedia(variant?.featured_media?.id);
          this.updateURL(variant?.id);
          this.updateVariantInputs(variant?.id);
          this.updateSourceFromDestination(html, `add-to-cart-container-${this.dataset.section}`);
          this.updateSourceFromDestination(html, `variant-selector-${this.dataset.section}`);
          this.updateSourceFromDestination(html, `price-${this.dataset.section}`);
          this.updateSourceFromDestination(html, `sku-${this.dataset.section}`);
          this.updateSourceFromDestination(html, `inventory-${this.dataset.section}`);
          this.updateAddToCartButton();
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted by user');
        } else {
          console.error(error);
        }
      });
  }
}

if (!customElements.get('product-info')) {
  customElements.define('product-info', ProductInfo);
}