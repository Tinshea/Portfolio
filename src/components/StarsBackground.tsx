"use client";

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { random } from 'maath';
import { Box, useTheme} from '@mui/material';
import { useReducedMotion } from 'framer-motion';

const StarBackground = (props: any) => {
  const ref: any = useRef();
  // Length must be a multiple of 3 (x,y,z per star): a non-multiple leaves
  // trailing NaN values and THREE computes a NaN bounding sphere, which can
  // cull the whole starfield.
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5001), { radius: 1.2 })
  );
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme.palette.mode === 'dark';

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        {/* Light mode needs darker, larger points to stay visible on the
            near-white background; dark mode keeps the original cyan dust. */}
        <PointMaterial
          transparent
          color={isDark ? theme.palette.secondary.main : '#1d5468'}
          size={isDark ? 0.002 : 0.003}
          opacity={isDark ? 1 : 0.9}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => (
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
    <Canvas camera={{ position: [0, 0, 1] }}>   
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </Box>
);

export default StarsCanvas;