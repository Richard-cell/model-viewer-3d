# Model Viewer 3D

Visor de modelos 3D interactivo desarrollado con **Three.js** y **Vite**, aplicando principios de arquitectura limpia y separación de responsabilidades.

---

## 🚀 Demo en vivo

[https://richard-cell.github.io/cube-viewer-3d/](https://richard-cell.github.io/model-viewer-3d/)

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| JavaScript | ES2022 | Lenguaje principal — clases con `#private`, ES Modules, async/await |
| Three.js | 0.183.1 | Motor 3D — escena, cámara, luces, geometrías, renderer WebGL |
| Vite | Latest | Bundler y servidor de desarrollo |
| GLTFLoader | Incluido en Three.js | Carga modelos `.glb` con animaciones |
| CSS3 | — | Estilos, layout grid, variables, animaciones |
| WebGL | — | API gráfica del browser usada por Three.js |

---

---

## ⚙️ Cómo correrlo localmente

### Requisitos

- Node.js 18+
- npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/richard-cell/cube-viewer-3d.git
cd cube-viewer-3d

# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev
```

Abrir en el browser: `http://localhost:5173`


## ✨ Funcionalidades

- Visualización de modelos 3D primitivos (cubo, esfera, cilindro).
- Carga de modelo GLB externo con animación, modelo de Richard.
- Cambio de texturas procedurales en tiempo real.
- Presets de iluminación (cálida, fría, neón).
- Rotación con mouse, touch y botones.
- Zoom con scroll.
