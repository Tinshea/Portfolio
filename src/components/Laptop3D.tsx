import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

const Model: React.FC<{ path: string; lidAngle: number; laptopColor: string }> = ({ path, lidAngle, laptopColor }) => {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Object3D | null>(null);
  const [currentLidAngle, setCurrentLidAngle] = useState(lidAngle);

  // Load a texture for the emissive map
  const emissiveTexture = useTexture('/model/screen.jpg'); // Replace with your emissive texture path

  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current); // Calculate bounding box
      const size = new THREE.Vector3();
      box.getSize(size);

      const maxDimension = Math.max(size.x, size.y, size.z);
      const scaleFactor = 1.75; // Scale model larger
      const scale = scaleFactor / maxDimension;
      groupRef.current.scale.set(scale, scale, scale);

      const center = new THREE.Vector3();
      box.getCenter(center);
      groupRef.current.position.set(-center.x, -center.y, -center.z); // Center the model
      groupRef.current.position.y -= 0.5; // Adjust the Y position

      // Find the lid part by name (adjust the name based on your model structure)
      lidRef.current = scene.getObjectByName('Bevels_2') as THREE.Object3D | null;

      // Find the screen object and modify its emissive map
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Change the color of the laptop body
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color.set(laptopColor); // Change color here
          }

          // Find the screen object and modify its emissive map
          if (child.name === 'Object_7' && child.material instanceof THREE.MeshStandardMaterial) {
            const material = child.material;
            material.color.set(0, 0, 0); // Set screen to black
            material.emissive.set(1, 1, 1); // Emissive color
            material.roughness = 0.2;
            material.metalness = 0.8;
            material.map = null;
            material.emissiveMap = emissiveTexture; // Emissive map texture
          }
        }
      });
    }
  }, [scene]);

  // Smoothly animate the lid
  useEffect(() => {
    if (lidRef.current) {
      const animateLid = () => {
        const easing = 0.1; // Easing factor to make the motion smoother
        const newAngle = THREE.MathUtils.lerp(currentLidAngle, lidAngle, easing);
        setCurrentLidAngle(newAngle);

        if (lidRef.current) {
          lidRef.current.rotation.x = newAngle;
        }
        
        // Continue animating as long as there's a change
        if (Math.abs(newAngle - lidAngle) > 0.001) {
          requestAnimationFrame(animateLid);
        }
      };

      animateLid();
    }
  }, [lidAngle, currentLidAngle]);

  return <group ref={groupRef}><primitive object={scene} /></group>;
};

const App: React.FC = () => {
  const [lidAngle, setLidAngle] = useState(-2 * Math.PI / 3); // Lid angle in radians
  const prefersReducedMotion = useReducedMotion();

  // Scroll event handler
  const handleScroll = () => {
    const scrollTop = window.scrollY - 400;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = 1.25 * scrollTop / docHeight;
    const newAngle = -2 * Math.PI / 3 + scrollFraction * (2 * Math.PI / 3); // Adjust the angle based on scroll position
    setLidAngle(Math.max(-2 * Math.PI / 3, Math.min(0, newAngle)));
  };

  useEffect(() => {
    // Skip the scroll-driven lid animation for users who prefer reduced motion
    if (prefersReducedMotion) return;

    // Add scroll listener on mount
    window.addEventListener('scroll', handleScroll);

    // Clean up listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      style={{
        width: '100%',               // Largeur du modèle
        height: '100%',              // Hauteur du modèle
      }}
    >
      {/* Canvas for the 3D scene */}
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [2, 2, 3], fov: 35 }} // Camera positioned to the upper-left
      >
        {/* Add lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />

        {/* Render the 3D model */}
        <Suspense fallback={null}>
          <Model path="/model/laptop_model.glb" lidAngle={lidAngle} laptopColor="#3e485f" />
        </Suspense>

        {/* Add orbit controls for interaction */}
        <OrbitControls enableZoom={false} enablePan={false}/>
      </Canvas>
    </div>
  );
};

export default App;
