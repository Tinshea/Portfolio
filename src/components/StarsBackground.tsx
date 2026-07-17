"use client";

import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { useReducedMotion } from 'framer-motion';

// Plain-canvas port of the previous three.js starfield: points scattered in a
// sphere, slowly rotating, perspective-projected from a camera at z = 1. Same
// visual for ~500 KB less JavaScript.
const STAR_COUNT = 1200;
const RADIUS = 1.2;
const TILT = Math.PI / 4;
const FOCAL = 1.3; // ≈ 75° vertical field of view, like the three.js default

// Hidden constellations, revealed as the sphere rotates: the Drill, the
// Arrow, the Butterfly, and Ulysses' Ship whose masthead star carries the
// page accent (the guiding star). Each is a small 2D figure embedded on a
// tangent plane of the sphere so it travels with the dust.
interface Constellation {
  center: [number, number, number];
  scale: number;
  points: [number, number][];
  edges: [number, number][];
  accentIndex?: number;
}

const CONSTELLATIONS: Constellation[] = [
  // Centers live on the FAR hemisphere (negative z): the camera sits inside
  // the star sphere, so far-side points project near the screen center while
  // near-side points land off-screen. Four figures, four screen quadrants.
  {
    // The Drill (spiral)
    center: [0.55, 0.5, -0.75],
    scale: 0.3,
    points: [
      [0, 0], [0.12, 0.08], [0.05, 0.22], [-0.15, 0.18], [-0.24, -0.04],
      [-0.08, -0.28], [0.22, -0.26], [0.38, 0.02], [0.24, 0.34],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
  },
  {
    // The Arrow
    center: [-0.6, 0.45, -0.7],
    scale: 0.32,
    points: [
      [-0.35, 0.28], [-0.05, 0.05], [0.3, -0.22], [0.1, -0.26], [0.3, -0.02],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4]],
  },
  {
    // The Butterfly
    center: [-0.5, -0.55, -0.7],
    scale: 0.3,
    points: [
      [0, 0.14], [0, -0.1], [-0.26, 0.3], [-0.3, -0.08], [0.26, 0.3], [0.3, -0.08],
    ],
    edges: [[0, 1], [0, 2], [2, 3], [3, 1], [0, 4], [4, 5], [5, 1]],
  },
  {
    // Ulysses' Ship: hull, mast, sail; the masthead star is the accent.
    center: [0.6, -0.5, -0.7],
    scale: 0.36,
    points: [
      [-0.3, -0.14], [0.3, -0.14], [0.2, -0.26], [-0.2, -0.26],
      [0, -0.14], [0, 0.26], [0.22, 0.02], [0.02, 0.02],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7]],
    accentIndex: 5,
  },
];

// Embed each figure's 2D points on the sphere once (local tangent basis).
function embedConstellations(): { xyz: Float32Array; meta: Constellation }[] {
  return CONSTELLATIONS.map((constellation) => {
    const [cx, cy, cz] = constellation.center;
    const len = Math.hypot(cx, cy, cz);
    const nx = cx / len, ny = cy / len, nz = cz / len;
    // Basis vectors of the tangent plane at the center direction.
    let ux = -ny, uy = nx, uz = 0;
    const ulen = Math.hypot(ux, uy, uz) || 1;
    ux /= ulen; uy /= ulen; uz /= ulen;
    const vx = ny * uz - nz * uy;
    const vy = nz * ux - nx * uz;
    const vz = nx * uy - ny * ux;

    const xyz = new Float32Array(constellation.points.length * 3);
    constellation.points.forEach(([u, v], i) => {
      const su = u * constellation.scale;
      const sv = v * constellation.scale;
      xyz[i * 3] = nx * RADIUS + ux * su + vx * sv;
      xyz[i * 3 + 1] = ny * RADIUS + uy * su + vy * sv;
      xyz[i * 3 + 2] = nz * RADIUS + uz * su + vz * sv;
    });
    return { xyz, meta: constellation };
  });
}

function createStars(): Float32Array {
  const stars = new Float32Array(STAR_COUNT * 3);
  const cos = Math.cos(TILT);
  const sin = Math.sin(TILT);
  for (let i = 0; i < STAR_COUNT; i++) {
    // Rejection sampling keeps the distribution uniform inside the sphere.
    let x = 0, y = 0, z = 0;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
    } while (x * x + y * y + z * z > 1);
    // Pre-tilt around Z, as the previous <group rotation={[0,0,π/4]}> did.
    stars[i * 3] = (x * cos - y * sin) * RADIUS;
    stars[i * 3 + 1] = (x * sin + y * cos) * RADIUS;
    stars[i * 3 + 2] = z * RADIUS;
  }
  return stars;
}

const StarsBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme.palette.mode === 'dark';
  // Neutral star dust: bone-blue on the night sky, ink on paper (dark and
  // large enough to read on the ivory background). The page accent appears
  // on exactly one star: the Ship's masthead.
  const color = isDark ? '#AEB2C4' : '#2C3040';
  const accent = isDark ? '#E24B60' : '#A3122E';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars = createStars();
    const constellations = embedConstellations();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Resizing clears the bitmap; with reduced motion no loop will repaint it.
      if (prefersReducedMotion) requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize);

    let angleX = 0;
    let angleY = 0;
    let last = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      // Slightly faster on X: the dominant apparent motion of the dust reads
      // as a slow, continuous ascent.
      angleX -= delta / 7;
      angleY -= delta / 12;

      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const scale = (height / 2) * FOCAL;
      const baseSize = isDark ? 0.9 : 1.5;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = isDark ? 1 : 0.95;
      ctx.fillStyle = color;

      for (let i = 0; i < STAR_COUNT; i++) {
        const x = stars[i * 3];
        const y = stars[i * 3 + 1];
        const z = stars[i * 3 + 2];
        // Rotate around X, then Y.
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        // Camera at z = 1 looking at the origin.
        const depth = 1 - z2;
        if (depth < 0.1) continue;
        const sx = width / 2 + (x2 / depth) * scale;
        const sy = height / 2 + (y1 / depth) * scale;
        if (sx < 0 || sx > width || sy < 0 || sy > height) continue;
        const size = Math.min(baseSize / depth, 3);
        ctx.fillRect(sx, sy, size, size);
      }

      // Constellations: hairline edges, brighter nodes; drawn with the same
      // rotation so they drift through the field and get discovered.
      const project = (x: number, y: number, z: number) => {
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;
        const depth = 1 - z2;
        if (depth < 0.15) return null;
        return {
          sx: width / 2 + (x2 / depth) * scale,
          sy: height / 2 + (y1 / depth) * scale,
          depth,
        };
      };

      for (const { xyz, meta } of constellations) {
        const nodes = [];
        for (let i = 0; i < xyz.length / 3; i++) {
          nodes.push(project(xyz[i * 3], xyz[i * 3 + 1], xyz[i * 3 + 2]));
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = isDark ? 0.24 : 0.32;
        for (const [a, b] of meta.edges) {
          const p = nodes[a];
          const q = nodes[b];
          if (!p || !q) continue;
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(q.sx, q.sy);
          ctx.stroke();
        }
        nodes.forEach((p, i) => {
          if (!p) return;
          const isAccent = meta.accentIndex === i;
          ctx.globalAlpha = isAccent ? 0.95 : isDark ? 0.7 : 0.85;
          ctx.fillStyle = isAccent ? accent : color;
          const size = Math.min((isAccent ? 2.4 : isDark ? 1.7 : 2) / p.depth, 4.5);
          ctx.fillRect(p.sx - size / 2, p.sy - size / 2, size, size);
        });
        ctx.fillStyle = color;
      }

      if (!prefersReducedMotion) {
        frame = requestAnimationFrame(draw);
      }
    };
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [isDark, color, accent, prefersReducedMotion]);

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </Box>
  );
};

export default StarsBackground;
