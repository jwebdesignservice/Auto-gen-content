/**
 * deck-stage.js — Fast Launch carousel renderer
 * Sizes the deck to exact pixel dimensions and handles slide navigation.
 */
(function () {
  class DeckStage extends HTMLElement {
    connectedCallback() {
      const w = Number(this.getAttribute('width'))  || 1080;
      const h = Number(this.getAttribute('height')) || 1920;
      const fmt = this.getAttribute('data-format') || 'tiktok';

      // Size the stage to exact canvas pixels
      this.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      `;

      // Propagate format to CSS
      this.setAttribute('data-format', fmt);

      // Build slide index
      this._slides = Array.from(this.querySelectorAll('.slide'));
      this._current = 0;
      this._show(0);

      // Keyboard navigation
      this._onKey = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.next();
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   this.prev();
      };
      window.addEventListener('keydown', this._onKey);

      // Click to advance
      this.addEventListener('click', () => this.next());
      this.style.cursor = 'pointer';
    }

    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
    }

    _show(idx) {
      this._slides.forEach((s, i) => {
        s.style.display = i === idx ? 'flex' : 'none';
      });
      this._current = idx;
      // Dispatch event for external counters
      this.dispatchEvent(new CustomEvent('slide-change', {
        detail: { index: idx, total: this._slides.length },
        bubbles: true
      }));
    }

    next() { this._show((this._current + 1) % this._slides.length); }
    prev() { this._show((this._current - 1 + this._slides.length) % this._slides.length); }
    goTo(n) { this._show(Math.max(0, Math.min(n, this._slides.length - 1))); }

    get slideCount() { return this._slides.length; }
    get currentIndex() { return this._current; }
  }

  customElements.define('deck-stage', DeckStage);

  // ── Slide counter overlay ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('deck-stage').forEach(stage => {
      // Wrap in a container so the counter sits outside the canvas
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:inline-flex;flex-direction:column;gap:8px;';
      stage.parentNode.insertBefore(wrapper, stage);
      wrapper.appendChild(stage);

      const counter = document.createElement('div');
      counter.style.cssText = 'color:#888;font:500 13px/1 monospace;text-align:center;letter-spacing:0.1em;';
      wrapper.appendChild(counter);

      const update = (e) => {
        const { index, total } = e.detail;
        counter.textContent = `${index + 1} / ${total}  ·  click or →`;
      };
      stage.addEventListener('slide-change', update);
      // Trigger once to set initial state
      stage.dispatchEvent(new CustomEvent('slide-change', {
        detail: { index: 0, total: stage.slideCount },
        bubbles: false
      }));
    });
  });
})();
