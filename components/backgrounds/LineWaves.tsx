'use client';

import { useEffect, useRef } from 'react';
// @ts-ignore — ogl has partial typings
import { Renderer, Program, Mesh, Triangle } from 'ogl';

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uColorCycleSpeed;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;
uniform float uLightMode;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float result = sin(coord * 2.123) * 0.2;
  result += sin(coord * 3.234 + t * 4.345) * 0.1;
  result += sin(coord * 0.589 + t * 0.934) * 0.5;
  return result;
}

float displaceB(float coord, float t) {
  float result = sin(coord * 1.345) * 0.3;
  result += sin(coord * 2.734 + t * 3.345) * 0.2;
  result += sin(coord * 0.189 + t * 0.934) * 0.3;
  return result;
}

vec2 rotate2D(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = coords * 2.0 - 1.0;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  float mouseWarp = 0.0;
  if (uEnableMouse) {
    vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
    float mDist = length(coords - mPos);
    mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);
  }

  float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
  float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

  vec2 fieldA = vec2(warpAx, warpAy);
  vec2 fieldB = vec2(warpBx, warpBy);
  vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

  float fadeTop    = smoothstep( uEdgeFadeWidth,  uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY   = blended.y * tileCount;
  float nY        = smoothNoise(abs(scaledY));

  float ridge = pow(
    step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)),
    5.0
  );

  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = vMask * lines;

  float cycleT   = fullT * uColorCycleSpeed;
  float rChannel = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float gChannel = (pattern + vMask  * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float bChannel = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col   = (rChannel * uColor1 + gChannel * uColor2 + bChannel * uColor3) * uBrightness;
  float alpha = clamp(length(col), 0.0, 1.0);

  if (uLightMode > 0.5) {
    vec3 weights   = pow(max(vec3(rChannel, gChannel, bChannel), vec3(0.0)), vec3(3.0));
    float weightSum = max(weights.r + weights.g + weights.b, 0.0001);
    vec3 chroma    = (weights.r * uColor1 + weights.g * uColor2 + weights.b * uColor3) / weightSum;
    float neutral  = min(chroma.r, min(chroma.g, chroma.b));
    chroma = max(chroma - vec3(neutral * 0.92), vec3(0.0));
    float peak = max(chroma.r, max(chroma.g, chroma.b));
    chroma = pow(clamp(chroma / max(peak, 0.0001), 0.0, 1.0), vec3(1.08));
    float ink = clamp(max(rChannel, max(gChannel, bChannel)) * uBrightness * 1.15, 0.0, 0.92);
    gl_FragColor = vec4(mix(vec3(1.0), chroma, ink), 1.0);
  } else {
    gl_FragColor = vec4(col, alpha);
  }
}
`;

export interface LineWavesProps {
  speed?: number;
  innerLineCount?: number;
  outerLineCount?: number;
  warpIntensity?: number;
  rotation?: number;
  edgeFadeWidth?: number;
  colorCycleSpeed?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
  lightMode?: boolean;
  className?: string;
  paused?: boolean;
}

export default function LineWaves({
  speed = 0.3,
  innerLineCount = 32,
  outerLineCount = 36,
  warpIntensity = 1.0,
  rotation = -45,
  edgeFadeWidth = 0.0,
  colorCycleSpeed = 1.0,
  brightness = 0.2,
  color1 = '#ffffff',
  color2 = '#ffffff',
  color3 = '#ffffff',
  enableMouseInteraction = true,
  mouseInfluence = 2.0,
  lightMode = false,
  className = '',
  paused = false,
}: LineWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tryStartRef  = useRef<() => void>(() => {});
  const tryStopRef   = useRef<() => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, antialias: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(canvas);

    const rotRad = (rotation * Math.PI) / 180;
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:           { value: 0 },
        uResolution:     { value: new Float32Array([1, 1, 1]) },
        uSpeed:          { value: speed },
        uInnerLines:     { value: innerLineCount },
        uOuterLines:     { value: outerLineCount },
        uWarpIntensity:  { value: warpIntensity },
        uRotation:       { value: rotRad },
        uEdgeFadeWidth:  { value: edgeFadeWidth },
        uColorCycleSpeed:{ value: colorCycleSpeed },
        uBrightness:     { value: brightness },
        uColor1:         { value: new Float32Array(hexToVec3(color1)) },
        uColor2:         { value: new Float32Array(hexToVec3(color2)) },
        uColor3:         { value: new Float32Array(hexToVec3(color3)) },
        uMouse:          { value: new Float32Array([0.5, 0.5]) },
        uMouseInfluence: { value: mouseInfluence },
        uEnableMouse:    { value: enableMouseInteraction },
        uLightMode:      { value: lightMode ? 1 : 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      program.uniforms.uResolution.value[2] = gl.drawingBufferWidth / gl.drawingBufferHeight;
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const currentMouse = [0.5, 0.5];
    const targetMouse  = [0.5, 0.5];
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    const onMouseLeave = () => { targetMouse[0] = 0.5; targetMouse[1] = 0.5; };
    if (enableMouseInteraction) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    }

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;

    const update = (time: number) => {
      program.uniforms.uTime.value = time * 0.001;
      if (enableMouseInteraction) {
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(update);
    };

    const tryStart = () => { if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(update); };
    const tryStop  = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } };
    tryStartRef.current = tryStart;
    tryStopRef.current  = tryStop;

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      isVisible ? tryStart() : tryStop();
    }, { threshold: 0 });
    io.observe(container);

    const onPageVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onPageVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onPageVisibility);
      if (enableMouseInteraction) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
      }
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paused) tryStopRef.current();
    else        tryStartRef.current();
  }, [paused]);

  return (
    <div
      ref={containerRef}
      className={`bg-canvas-fill ${className}`.trim()}
    />
  );
}
