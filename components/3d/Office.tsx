'use client';

import { useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, KeyboardControls, useKeyboardControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── Room dimensions ──────────────────────────────────────────────────────────
const W = 12;
const D = 12;
const H = 3.6;

// ── Warm palette ─────────────────────────────────────────────────────────────
const C = {
  wall:         '#1A1208',
  floor:        '#2C1A0E',
  ceiling:      '#130E07',
  desk:         '#6B4423',
  deskLeg:      '#4E3018',
  shelf:        '#3D2410',
  cork:         '#8B6914',
  chair:        '#1C1C1C',
  chairFrame:   '#2A2A2A',
  rug:          '#3B1F1A',
  plant:        '#2D5A1B',
  pot:          '#5C3D25',
  mug:          '#C8A96E',
  paper:        '#E8DEC8',
  stickyYellow: '#E8D060',
};

// ── Keyboard map ─────────────────────────────────────────────────────────────
const KEYS = [
  { name: 'forward',  keys: ['ArrowUp',    'w', 'W'] },
  { name: 'backward', keys: ['ArrowDown',  's', 'S'] },
  { name: 'left',     keys: ['ArrowLeft',  'a', 'A'] },
  { name: 'right',    keys: ['ArrowRight', 'd', 'D'] },
];

// ── Player movement ───────────────────────────────────────────────────────────
// Pre-allocate — never new THREE.* inside useFrame
const _dir   = new THREE.Vector3();
const _front = new THREE.Vector3();
const _side  = new THREE.Vector3();

function Player() {
  const [, get] = useKeyboardControls();
  const { camera } = useThree();
  const SPEED      = 4.5;
  const EYE_HEIGHT = 1.7;

  // Clamp bounds (stay inside room with margin)
  const XMIN = -W / 2 + 0.6;
  const XMAX =  W / 2 - 0.6;
  const ZMIN = -D / 2 + 0.6;
  const ZMAX =  D / 2 - 0.6;

  useFrame((_, delta) => {
    const { forward, backward, left, right } = get();

    _dir.set(
      (right  ? 1 : 0) - (left    ? 1 : 0),
      0,
      (backward ? 1 : 0) - (forward ? 1 : 0),
    );

    if (_dir.lengthSq() > 0) {
      _dir.normalize().multiplyScalar(SPEED * delta);

      // Project movement into camera's horizontal plane
      camera.getWorldDirection(_front);
      _front.y = 0;
      _front.normalize();
      _side.crossVectors(_front, camera.up).normalize();

      const move = _front.clone().multiplyScalar(-_dir.z)
                          .addScaledVector(_side, _dir.x);

      camera.position.x = THREE.MathUtils.clamp(camera.position.x + move.x, XMIN, XMAX);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + move.z, ZMIN, ZMAX);
    }

    // Lock eye height
    camera.position.y = EYE_HEIGHT;
  });

  return null;
}

// ── Room shell ───────────────────────────────────────────────────────────────
function Room() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={C.floor} roughness={0.95} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={C.ceiling} roughness={1} />
      </mesh>
      {/* Back wall */}
      <mesh receiveShadow position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={C.wall} roughness={1} />
      </mesh>
      {/* Rug */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.5]}>
        <planeGeometry args={[4.5, 3.5]} />
        <meshStandardMaterial color={C.rug} roughness={1} />
      </mesh>
    </group>
  );
}

// ── Window ────────────────────────────────────────────────────────────────────
function Window() {
  return (
    <group position={[0, 2.1, -D / 2 + 0.06]}>
      <mesh>
        <boxGeometry args={[2.2, 1.5, 0.1]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.8} />
      </mesh>
      {/* Glass — emissive warm glow */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.9, 1.2]} />
        <meshStandardMaterial
          color="#FFE8A0"
          emissive="#FFE8A0"
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          roughness={0}
        />
      </mesh>
      {/* Divider cross */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[1.92, 0.04, 0.01]} />
        <meshStandardMaterial color="#2A1A0A" />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.04, 1.24, 0.01]} />
        <meshStandardMaterial color="#2A1A0A" />
      </mesh>
    </group>
  );
}

// ── Door ──────────────────────────────────────────────────────────────────────
function Door() {
  return (
    <group position={[-W / 2 + 0.05, 1.05, 2.2]}>
      <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.1, 2.1, 0.07]} />
        <meshStandardMaterial color="#2E1A0A" roughness={0.8} />
      </mesh>
      <mesh position={[0.06, 0, 0.4]} rotation={[0, Math.PI / 2, 0]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#C8A040" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ── Desk ──────────────────────────────────────────────────────────────────────
function Desk() {
  const legPositions: [number, number][] = [[-1.25, -0.55], [1.25, -0.55], [-1.25, 0.55], [1.25, 0.55]];
  return (
    <group position={[0, 0, -1.2]}>
      {/* Surface */}
      <mesh castShadow receiveShadow position={[0, 0.78, 0]}>
        <boxGeometry args={[2.8, 0.07, 1.3]} />
        <meshStandardMaterial color={C.desk} roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Legs */}
      {legPositions.map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 0.38, z]}>
          <boxGeometry args={[0.07, 0.76, 0.07]} />
          <meshStandardMaterial color={C.deskLeg} roughness={0.7} />
        </mesh>
      ))}
      {/* Left side panel */}
      <mesh position={[-1.28, 0.38, 0]}>
        <boxGeometry args={[0.03, 0.68, 1.08]} />
        <meshStandardMaterial color={C.deskLeg} roughness={0.7} />
      </mesh>
      <Monitor />
      <PaperStack />
      <Mug />
      <StickyNote position={[0.72, 1.52, -0.32]} rotation={[0, -0.1,  0.05]} color={C.stickyYellow} />
      <StickyNote position={[0.88, 1.48, -0.31]} rotation={[0,  0.08, -0.04]} color="#D4E8A0" />
    </group>
  );
}

function Monitor() {
  return (
    <group position={[0, 0.82, -0.28]}>
      {/* Bezel */}
      <mesh castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[1.05, 0.68, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Screen — dim terminal green glow, no Html */}
      <mesh position={[0, 0.52, 0.03]}>
        <planeGeometry args={[0.93, 0.57]} />
        <meshStandardMaterial
          color="#0A120A"
          emissive="#1A3A1A"
          emissiveIntensity={2.5}
          roughness={0}
        />
      </mesh>
      {/* Screen light cast */}
      <pointLight position={[0, 0.52, 0.2]} intensity={0.4} color="#3A8A4A" distance={2} />
      {/* Stand */}
      <mesh position={[0, 0.07, 0.01]}>
        <boxGeometry args={[0.07, 0.14, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.32, 0.03, 0.22]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
}

function PaperStack() {
  return (
    <group position={[0.95, 0.82, 0.1]}>
      {[0, 0.005, 0.01, 0.015].map((y, i) => (
        <mesh key={i} castShadow position={[i * 0.003, y, i * 0.004]} rotation={[0, i * 0.03, 0]}>
          <boxGeometry args={[0.34, 0.005, 0.44]} />
          <meshStandardMaterial color={C.paper} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Mug() {
  return (
    <group position={[-0.9, 0.82, 0.2]}>
      <mesh castShadow position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.055, 0.048, 0.13, 12]} />
        <meshStandardMaterial color={C.mug} roughness={0.55} />
      </mesh>
      <mesh position={[0.07, 0.068, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.032, 0.009, 6, 10, Math.PI]} />
        <meshStandardMaterial color={C.mug} roughness={0.55} />
      </mesh>
    </group>
  );
}

function StickyNote({ position, rotation, color }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <mesh castShadow position={position} rotation={rotation}>
      <boxGeometry args={[0.16, 0.16, 0.003]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

// ── Chair ─────────────────────────────────────────────────────────────────────
function Chair() {
  return (
    <group position={[0, 0, 0.6]}>
      <mesh castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[0.58, 0.07, 0.56]} />
        <meshStandardMaterial color={C.chair} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.92, -0.25]}>
        <boxGeometry args={[0.58, 0.68, 0.06]} />
        <meshStandardMaterial color={C.chair} roughness={0.9} />
      </mesh>
      {([-0.26, 0.26] as number[]).map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.68, -0.03]}>
          <boxGeometry args={[0.05, 0.06, 0.42]} />
          <meshStandardMaterial color={C.chairFrame} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.44, 8]} />
        <meshStandardMaterial color={C.chairFrame} roughness={0.4} metalness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} castShadow
            position={[Math.cos(angle) * 0.28, 0.04, Math.sin(angle) * 0.28]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.28, 0.04, 0.05]} />
            <meshStandardMaterial color={C.chairFrame} roughness={0.5} metalness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Corkboard (left wall) ─────────────────────────────────────────────────────
function Corkboard() {
  const cards = [
    { pos: [0.04,  0.32, -0.7] as [number,number,number] },
    { pos: [0.04,  0.32,  0.1] as [number,number,number] },
    { pos: [0.04, -0.22, -0.3] as [number,number,number] },
  ];
  return (
    <group position={[-W / 2 + 0.1, 1.9, -2.5]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.6, 1.7, 0.06]} />
        <meshStandardMaterial color="#2E1E08" roughness={0.9} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.026, 0, 0]}>
        <boxGeometry args={[2.4, 1.55, 0.01]} />
        <meshStandardMaterial color={C.cork} roughness={1} />
      </mesh>
      {cards.map((c, i) => (
        <group key={i} position={c.pos} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.65, 0.44, 0.005]} />
            <meshStandardMaterial color="#F0E8D8" roughness={0.95} />
          </mesh>
          {/* Red pin */}
          <mesh position={[0, 0.18, 0.01]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#C83030" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Bookshelf (right wall) ────────────────────────────────────────────────────
function Bookshelf() {
  const books = [
    { w: 0.08, color: '#8B3A1A' },
    { w: 0.06, color: '#2E5E3A' },
    { w: 0.09, color: '#5A3A8A' },
    { w: 0.07, color: '#8A5A1A' },
    { w: 0.06, color: '#3A5A8A' },
  ];
  let offset = -0.88;
  return (
    <group position={[W / 2 - 0.12, 0, -2.5]}>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[2.4, 2.4, 0.06]} />
        <meshStandardMaterial color={C.shelf} roughness={0.85} />
      </mesh>
      {([-1.15, 1.15] as number[]).map((z, i) => (
        <mesh key={i} position={[0, 1.2, z]}>
          <boxGeometry args={[0.06, 2.4, 0.04]} />
          <meshStandardMaterial color={C.shelf} roughness={0.85} />
        </mesh>
      ))}
      {[0.06, 0.88, 1.66, 2.36].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[0.06, 0.04, 2.26]} />
          <meshStandardMaterial color={C.shelf} roughness={0.85} />
        </mesh>
      ))}
      {books.map((b, i) => {
        const z = offset;
        offset += b.w + 0.012;
        return (
          <mesh key={i} castShadow position={[-0.02, 0.5, z + b.w / 2]}>
            <boxGeometry args={[0.04, 0.76, b.w]} />
            <meshStandardMaterial color={b.color} roughness={0.8} />
          </mesh>
        );
      })}
      {/* "On order" wireframe slots */}
      {[-0.35, -0.05, 0.25].map((z, i) => (
        <mesh key={i} position={[-0.02, 1.28, z]}>
          <boxGeometry args={[0.035, 0.58, 0.065]} />
          <meshStandardMaterial color="#3A2810" roughness={1} wireframe />
        </mesh>
      ))}
    </group>
  );
}

// ── Desk lamp ─────────────────────────────────────────────────────────────────
function DeskLamp() {
  return (
    <group position={[-0.8, 0.82, -1.63]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.04, 10]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.015, 0.42, 0.015]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh castShadow position={[0.04, 0.47, 0]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.09, 0.14, 10, 1, true]} />
        <meshStandardMaterial color="#444" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.04, 0.38, 0]} intensity={1.8} color="#FFD060" distance={3.5} decay={2} />
    </group>
  );
}

// ── Plant (corner) ────────────────────────────────────────────────────────────
function Plant() {
  return (
    <group position={[-W / 2 + 0.5, 0, 1.6]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.22, 10]} />
        <meshStandardMaterial color={C.pot} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.096, 0.096, 0.02, 10]} />
        <meshStandardMaterial color="#1A0E08" roughness={1} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            castShadow
            position={[Math.cos(angle) * 0.07, 0.25 + i * 0.03, Math.sin(angle) * 0.07]}
            rotation={[0.55 + i * 0.05, angle, 0]}
          >
            <planeGeometry args={[0.16, 0.28]} />
            <meshStandardMaterial color={C.plant} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Lighting ──────────────────────────────────────────────────────────────────
function Lighting() {
  return (
    <>
      {/* HDRI — handles ambient + PBR reflections. Tiny fill only from ambientLight */}
      <ambientLight intensity={0.05} color="#FFE8C8" />
      {/* Window sun shaft — casts hard shadows */}
      <directionalLight
        castShadow
        position={[1, 3.5, -5]}
        intensity={0.9}
        color="#FFE0A0"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={24}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />
      {/* Corner warmth — artistic accent, not fill */}
      <pointLight position={[-4.5, 0.8, -4.5]} intensity={0.4} color="#FF7030" distance={7} decay={2} />
    </>
  );
}

// ── Scene (inside Canvas) ─────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <Environment files="/hdri/wooden_studio_08_1k.hdr" />
      <Lighting />
      <Room />
      <Window />
      <Door />
      <Desk />
      <DeskLamp />
      <Chair />
      <Corkboard />
      <Bookshelf />
      <Plant />
      <ContactShadows
        position={[0, 0.001, 0]}
        scale={14}
        blur={2.5}
        opacity={0.6}
        far={1.5}
        color="#1A0A00"
      />
      <Player />
    </>
  );
}

// ── HUD overlay (outside Canvas) ─────────────────────────────────────────────
function Overlay({ locked }: { locked: boolean }) {
  if (locked) return null;
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(13,10,6,0.62)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 13,
        letterSpacing: '0.1em',
        color: 'rgba(93,166,122,0.9)',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}>
        Click anywhere to enter
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 10,
        letterSpacing: '0.08em',
        color: 'rgba(245,240,232,0.25)',
        textTransform: 'uppercase',
      }}>
        WASD to move · mouse to look · ESC to exit
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function Office() {
  const [locked, setLocked] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D0A06' }}>
      <KeyboardControls map={KEYS}>
        <Canvas
          shadows
          camera={{ position: [0, 1.7, 4.5], fov: 75 }}
          gl={{
            antialias: true,
            precision: 'highp',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8,
          }}
        >
          <Scene />
          <PointerLockControls
            onLock={() => setLocked(true)}
            onUnlock={() => setLocked(false)}
          />
        </Canvas>
      </KeyboardControls>
      <Overlay locked={locked} />
    </div>
  );
}
