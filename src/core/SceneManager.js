import * as THREE from 'three';

/**
 * SceneManager
 * Responsible solely for:
 *   - Creating and managing the Three.js Scene, Camera, Renderer
 *   - Running the render loop (requestAnimationFrame)
 *   - Handling canvas resize
 */
export class SceneManager {
  #scene;
  #camera;
  #renderer;
  #container;
  #animateCallbacks = new Set();
  #rafId = null;

  /**
   * @param {HTMLElement}   container
   */
  constructor(container) {
    this.#container = container;
    this.#buildScene();
    this.#buildCamera();
    this.#buildRenderer();
    this.#setupResize();
  }

  get scene()    { return this.#scene; }
  get camera()   { return this.#camera; }
  get renderer() { return this.#renderer; }

  /**
   * Register a callback invoked every animation frame.
   * @param {Function} cb
   * @returns {Function} unregister function
   */
  onAnimate(cb) {
    this.#animateCallbacks.add(cb);
    return () => this.#animateCallbacks.delete(cb);
  }

  start() {
    const loop = () => {
      this.#rafId = requestAnimationFrame(loop);
      this.#animateCallbacks.forEach(cb => cb());
      this.#renderer.render(this.#scene, this.#camera);
    };
    loop();
  }

  stop() {
    if (this.#rafId !== null) cancelAnimationFrame(this.#rafId);
  }

  
  #buildScene() {
    this.#scene = new THREE.Scene();
    this.#scene.background = new THREE.Color('#707070');
    this.#scene.fog = new THREE.FogExp2(0x0a0b0e, 0.06);
  }

  #buildCamera() {
    const { clientWidth: w, clientHeight: h } = this.#container;
    this.#camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    const isMobile = w < 600;
    this.#camera.position.set(0, 1.2, isMobile ? 9 : 5);
  }

  #buildRenderer() {
    this.#renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    this.#renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer.shadowMap.enabled = true;
    this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.#setRendererSize();
    this.#container.appendChild(this.#renderer.domElement);
  }

  #setRendererSize() {
    const w = this.#container.clientWidth;
    const h = this.#container.clientHeight;
    this.#renderer.setSize(w, h, false);
  }

  #setupResize() {
    new ResizeObserver(() => {
        const w = this.#container.clientWidth;
        const h = this.#container.clientHeight;
        this.#renderer.setSize(w, h, false);
        this.#camera.aspect = w / h;
        this.#camera.updateProjectionMatrix();

        // Recalcula zoom según tamaño de pantalla
        const isMobile = w < 600;
        this.#camera.position.z = isMobile ? 9 : 5;

    }).observe(this.#container);
  }
}
