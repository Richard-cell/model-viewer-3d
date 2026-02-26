import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class RichardModelLoader {
    #mesh     = null;
    #material = null;
    #loader   = null;
    #mixer    = null;
    #clips    = [];

    constructor() {
        this.#loader = new GLTFLoader();
    }

    async load(url) {
        return new Promise((resolve, reject) => {
            this.#loader.load(
                url,
                (gltf) => {
                    this.#mesh = gltf.scene;
                    this.#clips = gltf.animations; // ← todas las animaciones

                    this.#mesh.traverse((child) => {
                        if (child.isMesh) {
                            this.#material = child.material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
       
                    this.#mixer = new THREE.AnimationMixer(this.#mesh);

                    if (this.#clips.length > 0) {
                        const action = this.#mixer.clipAction(this.#clips[0]);
                        action.play();
                    }

                    console.log(`Modelo cargado. Animaciones encontradas: ${this.#clips.length}`);
                    resolve(this.#mesh);
                },
                (xhr) => {
                    const porcentaje = (xhr.loaded / xhr.total) * 100;
                    if (porcentaje < 100) console.log(`Cargando: ${porcentaje}%`);
                },
                (error) => {
                    console.error("Error cargando el modelo GLB:", error);
                    reject(error);
                }
            );
        });
    }

    update(delta) {
        this.#mixer?.update(delta);
    }

    get object3D() { return this.#mesh; }
    get material()  { return this.#material; }
    get clips()     { return this.#clips; }
}