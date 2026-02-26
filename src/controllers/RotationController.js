/**
 * RotationController
 * Responsible solely for reading user input (mouse drag, touch, buttons)
 * and translating it into rotation deltas applied to a 3D model.
 */
export class RotationController {
  static IDLE_SPEED   = 0.004;
  static BUTTON_SPEED = 0.028;

  #currentModel;
  #canvas;
  #isDragging     = false;
  #prevMouse      = { x: 0, y: 0 };
  #buttonDelta    = 0;
  #cleanupFns     = [];

  /**
   * @param {CubeEntity}      cube
   * @param {HTMLCanvasElement} canvas
   */
  constructor(initialModel, canvas) {
    this.#currentModel   = initialModel;
    this.#canvas = canvas;
    this.#bindMouse();
    this.#bindTouch();
    this.#bindScroll();
  }
  setTarget(model){
    this.#currentModel = model;
  }

  
  rotate(camera) {
    if (this.#buttonDelta !== 0) {
      this.#currentModel.rotate(this.#buttonDelta * RotationController.BUTTON_SPEED);
    } else if (!this.#isDragging) {
      this.#currentModel.rotate(RotationController.IDLE_SPEED);
    }
  }

  /** Hook buttons from outside (UI layer should not call cube directly) */
  startButtonRotation(direction) { this.#buttonDelta = direction; }
  stopButtonRotation()           { this.#buttonDelta = 0; }

  /** Unbind all event listeners */
  destroy() {
    this.#cleanupFns.forEach(fn => fn());
  }


  #on(target, event, handler, opts) {
    target.addEventListener(event, handler, opts);
    this.#cleanupFns.push(() => target.removeEventListener(event, handler, opts));
  }

  #bindMouse() {
    this.#on(this.#canvas, 'mousedown', e => {
      this.#isDragging = true;
      this.#prevMouse  = { x: e.clientX, y: e.clientY };
    });
    this.#on(window, 'mouseup', () => { this.#isDragging = false; });
    this.#on(window, 'mousemove', e => {
      if (!this.#isDragging) return;
      const dx = (e.clientX - this.#prevMouse.x) * 0.012;
      const dy = (e.clientY - this.#prevMouse.y) * 0.012;
      this.#currentModel.rotate(dx, dy);
      this.#prevMouse = { x: e.clientX, y: e.clientY };
    });
  }

  #bindTouch() {
    this.#on(this.#canvas, 'touchstart', e => {
      this.#isDragging = true;
      this.#prevMouse  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    this.#on(window, 'touchend',  () => { this.#isDragging = false; });
    this.#on(window, 'touchmove', e => {
      if (!this.#isDragging) return;
      const dx = (e.touches[0].clientX - this.#prevMouse.x) * 0.012;
      const dy = (e.touches[0].clientY - this.#prevMouse.y) * 0.012;
      this.#currentModel.rotate(dx, dy);
      this.#prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
  }

  #bindScroll() {
    this.#on(this.#canvas, 'wheel', e => {
      
      this._zoomDelta = e.deltaY * 0.008;
    }, { passive: true });
  }
}
