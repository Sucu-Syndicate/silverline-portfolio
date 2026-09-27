'use client';

import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

function LaptopModel({ objUrl, mtlUrl }: { objUrl: string; mtlUrl: string }) {
  const materials = useLoader(MTLLoader, mtlUrl);
  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    materials.preload();
    (loader as OBJLoader).setMaterials(materials);
  });
  return <primitive object={obj} />;
}

export interface ModelViewerProps {
  url: string;
  mtlUrl?: string;
  width?: number | string;
  height?: number | string;
  autoRotate?: boolean;
  rotateSpeed?: number;
  cameraZ?: number;
  fov?: number;
}

export default function ModelViewer({
  url,
  mtlUrl,
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
        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 8, 4]} intensity={1.4} castShadow />
        <directionalLight position={[-4, 2, -4]} intensity={0.45} color="#a0c8ff" />

        <Suspense fallback={null}>
          {mtlUrl ? (
            <LaptopModel objUrl={url} mtlUrl={mtlUrl} />
          ) : (
            <ObjOnly url={url} />
          )}
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

// Fallback for OBJ-only (no MTL) with a default silver material
function ObjOnly({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url);
  return <primitive object={obj} />;
}
