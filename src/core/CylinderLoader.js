import * as THREE from 'three';
/**
 * ModelEntity
 * Responsible solely for the mesh: geometry, material,
 * edge wireframe, and applying texture swaps.
 */
export class CylinderLoader {
    /**
   * @param {THREE.Texture[]}   textures
   */
    
    #mesh;
    #material;
    #textures;

    constructor(textures) {
      this.#textures = textures;

      this.#material = new THREE.MeshStandardMaterial({
            map: textures[0],
            roughness: 0.45,
            metalness: 0.35,
        });

      this.#mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 2, 32),
        this.#material
      );
      this.#mesh.castShadow = true;

      
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