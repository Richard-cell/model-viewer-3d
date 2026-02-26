import * as THREE from 'three';

/**
 * TextureFactory
 * Responsible solely for creating THREE.CanvasTexture instances.
 */
export class TextureFactory {

  constructor() {
  }

  createAll() {
    return [
      this.#makeConcreteTexture(),
      this.#makeMetalTexture(),
      this.#makeEmeraldTexture(),
    ];
  }

  
  #canvasTexture(drawFn, size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    drawFn(canvas.getContext('2d'), size);
    return new THREE.CanvasTexture(canvas);
  }

  #makeConcreteTexture() {
    return this.#canvasTexture((ctx, s) => {
      ctx.fillStyle = '#b5651d';
      ctx.fillRect(0, 0, s, s);

      const bw = 64, bh = 28;
      ctx.strokeStyle = '#7a4011';
      ctx.lineWidth = 3;

      for (let row = 0; row * bh < s + bh; row++) {
        const offset = (row % 2 === 0) ? 0 : bw / 2;
        for (let col = -1; col * bw < s + bw; col++) {
          ctx.strokeRect(col * bw + offset + 2, row * bh + 2, bw - 4, bh - 4);
        }
      }

      for (let i = 0; i < 1200; i++) {
        const alpha = Math.random() * 0.12;
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(255,255,255,${alpha})`
          : `rgba(0,0,0,${alpha})`;
        ctx.fillRect(Math.random() * s, Math.random() * s, 1.5, 1.5);
      }
    });
  }

  #makeMetalTexture() {
    return this.#canvasTexture((ctx, s) => {
      const grad = ctx.createLinearGradient(0, 0, s, s);
      grad.addColorStop(0, '#1c2a3a');
      grad.addColorStop(0.5, '#3a6b9e');
      grad.addColorStop(1, '#1c2a3a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, s, s);


      for (let y = 0; y < s; y += 3) {
        ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.06})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(s, y);
        ctx.stroke();
      }


      const shine = ctx.createLinearGradient(0, 0, s, 0);
      shine.addColorStop(0, 'rgba(255,255,255,0)');
      shine.addColorStop(0.45, 'rgba(255,255,255,0.18)');
      shine.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shine;
      ctx.fillRect(0, 0, s, s);
    });
  }

  #makeEmeraldTexture() {
    return this.#canvasTexture((ctx, s) => {
      ctx.fillStyle = '#1a4731';
      ctx.fillRect(0, 0, s, s);

      const facets = [
        { pts: [0,0, s/2,s/3, 0,s/2],          color: '#27ae60' },
        { pts: [s,0, s/2,s/3, s,s/2],           color: '#1e8449' },
        { pts: [0,s/2, s/2,s/3, s/2,s],         color: '#2ecc71' },
        { pts: [s,s/2, s/2,s/3, s/2,s],         color: '#1a5e36' },
        { pts: [0,0, s/2,0, s/2,s/3],           color: '#239b56' },
        { pts: [s/2,0, s,0, s/2,s/3],           color: '#145a32' },
        { pts: [0,s, s/2,s, s/2,s*0.67],        color: '#1e8449' },
        { pts: [s/2,s, s,s, s/2,s*0.67],        color: '#27ae60' },
      ];

      facets.forEach(({ pts, color }) => {
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        ctx.lineTo(pts[2], pts[3]);
        ctx.lineTo(pts[4], pts[5]);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      const gloss = ctx.createRadialGradient(s * 0.35, s * 0.3, 0, s * 0.35, s * 0.3, s * 0.5);
      gloss.addColorStop(0, 'rgba(255,255,255,0.3)');
      gloss.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gloss;
      ctx.fillRect(0, 0, s, s);
    });
  }
}
