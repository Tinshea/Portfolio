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
  // Neutral star dust: bone-blue on the night sky, ink-blue on paper. The
  // page accent stays reserved for interactive elements.
  const color = isDark ? '#AEB2C4' : '#3A3F55';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars = createStars();
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
      angleX -= delta / 10;
      angleY -= delta / 15;

      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const scale = (height / 2) * FOCAL;
      const baseSize = isDark ? 0.9 : 1.2;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = isDark ? 1 : 0.9;
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
  }, [isDark, color, prefersReducedMotion]);

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
