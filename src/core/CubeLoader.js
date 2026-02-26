import * as THREE from 'three';

/**
 * ModelEntity
 * Responsible solely for the mesh: geometry, material,
 * edge wireframe, and applying texture swaps.
 */
export class CubeLoader {
  #mesh;
  #material;
  #textures;

  /**
   * @param {THREE.Texture[]}   textures
   */
  constructor(textures) {
    this.#textures = textures;

    const geometry = new THREE.BoxGeometry(2, 2, 2);

    this.#material = new THREE.MeshStandardMaterial({
      map: textures[0],
      roughness: 0.45,
      metalness: 0.35,
    });

    this.#mesh = new THREE.Mesh(geometry, this.#material);
    this.#mesh.castShadow = true;

    // Edge highlights
    const edgeGeo  = new THREE.EdgesGeometry(geometry);
    const edgeMat  = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.18,
    });
    this.#mesh.add(new THREE.LineSegments(edgeGeo, edgeMat));
  }

  get object3D() {
    return this.#mesh;
  }

  applyTexture(index) {
    const tex = this.#textures[index];
    if (!tex) return;
    this.#material.map = tex;
    this.#material.needsUpdate = true;
  }
  rotate(deltaY, deltaX = 0) {
    this.#mesh.rotation.y += deltaY;
    this.#mesh.rotation.x += deltaX;
  }
}
