import * as THREE from 'three';

/**
 * LightingManager
 * Responsible solely for adding lights to the scene
 * and switching between lighting presets.
 */
export class LightingManager {
  static PRESETS = [
    {
      label: 'Luz Cálida',
      ambient:  { color: '#fff3d0', intensity: 0.7 },
      direct:   { color: '#fff3d0', intensity: 0.7, position: [4, 6, 4] },
      fill:     { color: '#fff3d0', intensity: 0.1, position: [-3, 2, -3] },
      rim:      { color: '#fff3d0', intensity: 0.1, position: [0, -3, -4] },
    },
    {
      label: 'Luz Fría',
      ambient:  { color: 0xd0e8ff, intensity: 0.35 },
      direct:   { color: 0xb3e5fc, intensity: 1.3, position: [4, 6, 4] },
      fill:     { color: 0x80d8ff, intensity: 0.6, position: [-3, 2, -3] },
      rim:      { color: 0x0077ff, intensity: 0.4, position: [0, -3, -4] },
    },
    {
      label: 'Neón Rosa',
      ambient:  { color: 0x1a001a, intensity: 0.2 },
      direct:   { color: 0xff80ab, intensity: 1.7, position: [4, 6, 4] },
      fill:     { color: 0xea80fc, intensity: 0.9, position: [-3, 2, -3] },
      rim:      { color: 0x00e5ff, intensity: 0.6, position: [0, -3, -4] },
    },
  ];

  #scene;
  #ambientLight;
  #directLight;
  #fillLight;
  #rimLight;

  constructor(scene) {
    this.#scene = scene;
    this.#buildLights();
  }

  applyPreset(index) {
    const preset = LightingManager.PRESETS[index];
    if (!preset) return;

    this.#ambientLight.color.set(preset.ambient.color);
    this.#ambientLight.intensity = preset.ambient.intensity;

    this.#directLight.color.set(preset.direct.color);
    this.#directLight.intensity = preset.direct.intensity;
    this.#directLight.position.set(...preset.direct.position);

    this.#fillLight.color.set(preset.fill.color);
    this.#fillLight.intensity = preset.fill.intensity;
    this.#fillLight.position.set(...preset.fill.position);

    this.#rimLight.color.set(preset.rim.color);
    this.#rimLight.intensity = preset.rim.intensity;
    this.#rimLight.position.set(...preset.rim.position);
  }

  
  #buildLights() {
    this.#ambientLight = new THREE.AmbientLight('#fff3d0', 0.4);
    this.#scene.add(this.#ambientLight);

    this.#directLight = new THREE.DirectionalLight('#fff3d0', 1.5);
    this.#directLight.castShadow = true;
    this.#directLight.shadow.mapSize.set(1024, 1024);
    this.#scene.add(this.#directLight);

    this.#fillLight = new THREE.PointLight('#fff3d0', 0.5, 30);
    this.#scene.add(this.#fillLight);

    this.#rimLight = new THREE.PointLight('#fff3d0', 0.3, 30);
    this.#scene.add(this.#rimLight);

    this.applyPreset(0);
  }
}
