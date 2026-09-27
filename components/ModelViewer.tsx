'use client';

import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';

function ObjModel({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url);

  // Apply a clean silver material to all meshes (no texture maps shipped for web)
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xc8c8d0),
        metalness: 0.8,
        roughness: 0.25,
      });
    }
  });

  return <primitive object={obj} />;
}

export interface ModelViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  autoRotate?: boolean;
  rotateSpeed?: number;
  cameraZ?: number;
  fov?: number;
}

export default function ModelViewer({
  url,
  width  = 400,
  height = 400,
  autoRotate  = true,
  rotateSpeed = 0.8,
  cameraZ     = 5,
  fov         = 45,
}: ModelViewerProps) {
  return (
    <div style={{ width, height, position: 'relative' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, cameraZ], fov }}
        gl={{ antialias: false, alpha: true, preserveDrawingBuffer: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[8, 8, 4]} intensity={1.2} castShadow />
        <directionalLight position={[-4, 2, -4]} intensity={0.4} color="#a0c8ff" />

        <Suspense fallback={null}>
          <ObjModel url={url} />
          <Environment preset="city" />
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={rotateSpeed}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
