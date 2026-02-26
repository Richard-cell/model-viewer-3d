/**
 * This module is responsible for orchestrating the main flow, instantiating modules, and more. It serves as the entry point of the application, tying together the UI and 3D components.
 */
import * as THREE from 'three';
import { EventBus }          from './ui/EventBus.js';
import { PanelUI }           from './ui/PanelUI.js';
import { SceneManager }      from './core/SceneManager.js';
import { LightingManager }   from './core/LightingManager.js';
import { TextureFactory }    from './core/TextureFactory.js';
import { CubeLoader }        from './core/CubeLoader.js';
import { RotationController } from './controllers/RotationController.js';
import {SphereLoader}         from "./core/SphereLoader.js";
import {CylinderLoader}       from "./core/CylinderLoader.js";
import {RichardModelLoader}   from "./core/RichardModelLoader.js";

document.addEventListener('DOMContentLoaded', async () => {

  const bus = new EventBus();

  const sceneManager  = new SceneManager(document.getElementById('viewport'));
  const { scene, camera } = sceneManager;
  const timer = new THREE.Timer();

  const textureFactory = new TextureFactory();
  const textures       = textureFactory.createAll();

  const models = [
    new CubeLoader(textures),
    new SphereLoader(textures),
    new CylinderLoader(textures),
  ];

  let richardLoader = null
  try {
        richardLoader = new RichardModelLoader();
        const mesh = await richardLoader.load('/model-viewer-3d/Richard.glb');
        mesh.position.set(-3, -1.6, 0);
        mesh.scale.set(3, 3, 3);
        const target = new THREE.Vector3();
        camera.getWorldPosition(target);
        target.y = mesh.position.y;
        mesh.lookAt(target);

        scene.add(mesh); 
    } catch (err) {
        console.error("No se pudo montar el modelo", err);
    }


  let activeModelIndex = 0;
  let activeTextureIndex = 0;
  scene.add(models[activeModelIndex].object3D);

  function switchModel(index) {
    scene.remove(models[activeModelIndex].object3D);
    activeModelIndex = index;
    scene.add(models[activeModelIndex].object3D);
    rotCtrl.setTarget(models[activeModelIndex]);
    models[activeModelIndex].applyTexture(activeTextureIndex);
  }

  const lighting = new LightingManager(scene);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.ShadowMaterial({ opacity: 0.25 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y  = -1.6;
  ground.receiveShadow = true;
  scene.add(ground);

  const rotCtrl = new RotationController(models[0], sceneManager.renderer.domElement);

  window.__rotCtrl = rotCtrl;

  sceneManager.onAnimate(() => {
    timer.update();
    const delta = timer.getDelta();
    richardLoader?.update(delta); 
    
    if (rotCtrl._zoomDelta) {
      camera.position.z = Math.max(2.5, Math.min(9, camera.position.z + rotCtrl._zoomDelta));
      rotCtrl._zoomDelta = 0;
    }
    rotCtrl.rotate();
  });

  bus.on('texture:change', ({ index }) => {
    models[activeModelIndex].applyTexture(index);
    activeTextureIndex = index;
  } );
  bus.on('light:change',   ({ index }) => lighting.applyPreset(index));
  bus.on('model:change',   ({ index }) => switchModel(index));

  new PanelUI(bus, [
    {
      containerId: 'panel-textures',
      event: 'texture:change',
      options: [
        { label: 'Ladrillo',  icon: '🧱', description: 'Textura de ladrillo rojo' },
        { label: 'Metal',     icon: '🔷', description: 'Acabado metálico azul'    },
        { label: 'Esmeralda', icon: '💎', description: 'Gema facetada verde'      },
      ],
    },
    {
      containerId: 'panel-lights',
      event: 'light:change',
      options: [
        { label: 'Cálida',  icon: '☀️', description: 'Iluminación solar dorada'  },
        { label: 'Fría',    icon: '❄️', description: 'Luz azul de estudio'       },
        { label: 'Neón',    icon: '🌸', description: 'Atmósfera neón rosa'       },
      ],
    },
    {
      containerId: 'panel-models',
      event: 'model:change',
      options: [
        { label: 'Cubo',  icon: '🧊', description: 'Modelo de cubo estándar' },
        { label: 'Esfera', icon: '🪩', description: 'Modelo de esfera suave'   },
        { label: 'Cilindro', icon: '🛢️', description: 'Modelo de cilindro sólido' },

      ],
    }
  ]);

  sceneManager.start();
});