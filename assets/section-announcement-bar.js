if (!customElements.get('announcement-rotator')) {
  customElements.define(
    'announcement-rotator',
    class AnnouncementRotator extends HTMLElement {
      constructor() {
        super();
        this.texts = Array.from(this.querySelectorAll('.announcement-bar__text'));
        this.currentIndex = 0;
        this.interval = 6000; // 6 seconds per text
      }

      connectedCallback() {
        if (this.texts.length <= 1) {
          // If only one text, just show it without rotation
          if (this.texts.length === 1) {
            this.texts[0].classList.add('active');
          }
          return;
        }

        // Show first text
        this.texts[0].classList.add('active');

        // Start rotation
        this.startRotation();
      }

      disconnectedCallback() {
        if (this.rotationTimer) {
          clearInterval(this.rotationTimer);
        }
      }

      startRotation() {
        this.rotationTimer = setInterval(() => {
          this.rotateText();
        }, this.interval);
      }

      rotateText() {
        // Fade out current text
        const currentText = this.texts[this.currentIndex];
        currentText.classList.remove('active');

        // Move to next text
        this.currentIndex = (this.currentIndex + 1) % this.texts.length;

        // Fade in next text immediately (no delay for seamless transition)
        const nextText = this.texts[this.currentIndex];
        nextText.classList.add('active');
      }
    }
  );
}

