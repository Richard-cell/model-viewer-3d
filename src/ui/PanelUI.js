/**
 * PanelUI
 * Responsible solely for:
 *   - Rendering option buttons inside panel containers
 *   - Tracking active selection state
 *   - Emitting events through the EventBus
 */
export class PanelUI {
  #bus;
  #panels;

  /**
   * @param {EventBus} bus
   * @param {Array<PanelConfig>} panels
   *
   * PanelConfig = {
   *   containerId: string,
   *   event: string,           // bus event to emit on selection
   *   options: Array<{ label: string, icon: string, description: string }>
   * }
   */
  constructor(bus, panels) {
    this.#bus    = bus;
    this.#panels = panels;
    this.#render();
  }

  
  #render() {
    this.#panels.forEach(panel => {
      const container = document.getElementById(panel.containerId);
      if (!container) return;

      panel.options.forEach((opt, index) => {
        const btn = this.#createButton(opt, index, panel);
        container.appendChild(btn);

        // Auto-activate first option
        if (index === 0) this.#activate(btn, container, panel, index);
      });
    });
  }

  #createButton(opt, index, panel) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <span class="opt-icon">${opt.icon}</span>
      <span class="opt-text">
        <span class="opt-label">${opt.label}</span>
        <!--<span class="opt-desc">${opt.description}</span>-->
      </span>
      <span class="opt-index">0${index + 1}</span>
    `;
    btn.addEventListener('click', () => {
      this.#activate(btn, btn.parentElement, panel, index);
    });
    return btn;
  }

  #activate(btn, container, panel, index) {
    container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.#bus.emit(panel.event, { index });
  }
}
