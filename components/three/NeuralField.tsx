'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * NeuralField
 * -----------
 * The conceptual signature: an abstract neural lattice — sparse nodes (a few
 * larger "hub neurons"), thin synaptic edges, and a handful of signals that
 * travel along pathways like thought/data flow. DNA appears only as a faint
 * twisted ordering of the node cloud, never literally. Calm and minimal.
 *
 * Lazy-loaded (ssr:false). Reduced-motion renders a single static frame.
 * Pauses when scrolled out of view via the `active` prop (frameloop).
 */

// Palette aligned to the editorial teal/gold system (values are 0–1 RGB).
const WHITE = [0.86, 0.92, 0.88]; // warm off-white
const CYAN = [0.561, 0.89, 0.851]; // teal  #8fe3d9 (primary strand)
const VIOLET = [0.851, 0.729, 0.439]; // gold  #d9ba70 (secondary strand)
const GOLD = [0.95, 0.8, 0.45]; // bright gold (signal accents)

type Edge = { a: THREE.Vector3; b: THREE.Vector3 };

const nodeVert = /* glsl */ `
  uniform float uSize; uniform float uPixelRatio;
  attribute float aScale; attribute vec3 aColor;
  varying vec3 vColor; varying float vFade;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vFade = smoothstep(13.0, 4.0, -mv.z);
    gl_PointSize = clamp(uSize * aScale * uPixelRatio * (1.0 / -mv.z), 0.0, 40.0);
  }
`;
const nodeFrag = /* glsl */ `
  varying vec3 vColor; varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.5);
    gl_FragColor = vec4(vColor, a * (0.35 + 0.65 * vFade));
  }
`;
const lineVert = /* glsl */ `
  attribute vec3 aColor; varying vec3 vColor; varying float vFade;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vFade = smoothstep(13.0, 4.0, -mv.z);
  }
`;
const lineFrag = /* glsl */ `
  varying vec3 vColor; varying float vFade;
  void main() { gl_FragColor = vec4(vColor, 0.16 * vFade); }
`;

function pickColor(roll: number) {
  if (roll > 0.9) return VIOLET;
  if (roll > 0.76) return CYAN;
  return WHITE;
}

function buildNetwork(isMobile: boolean) {
  const N = isMobile ? 44 : 76;
  const height = 7.2;
  const twist = 1.7;
  const baseR = 2.05;

  const nodes: { p: THREE.Vector3; c: number[] }[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const y = (t - 0.5) * height;
    const strand = i % 2;
    const ang = t * twist * Math.PI * 2 + strand * Math.PI + (Math.random() - 0.5) * 1.7;
    const rad = baseR * (0.42 + Math.random() * 0.85);
    const x = Math.cos(ang) * rad + (Math.random() - 0.5) * 0.85;
    const z = Math.sin(ang) * rad * 0.8 + (Math.random() - 0.5) * 0.85;
    nodes.push({ p: new THREE.Vector3(x, y, z), c: pickColor(Math.random()) });
  }

  // sparse k-nearest-neighbour edges (organic, not a clean lattice)
  const k = 2;
  const maxLen = 3.1;
  const seen = new Set<string>();
  const edges: Edge[] = [];
  const degree = new Array(N).fill(0);
  for (let i = 0; i < N; i++) {
    const near = nodes
      .map((n, j) => ({ j, d: nodes[i].p.distanceTo(n.p) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d);
    let added = 0;
    for (const { j, d } of near) {
      if (added >= k || d > maxLen) break;
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      added++;
      degree[i]++;
      degree[j]++;
      edges.push({ a: nodes[i].p, b: nodes[j].p });
    }
  }

  const nodePos = new Float32Array(N * 3);
  const nodeCol = new Float32Array(N * 3);
  const nodeScale = new Float32Array(N);
  nodes.forEach((n, i) => {
    nodePos.set([n.p.x, n.p.y, n.p.z], i * 3);
    nodeCol.set(n.c, i * 3);
    nodeScale[i] = 5 + degree[i] * 2.4; // hubs are bigger
  });

  const linePos = new Float32Array(edges.length * 6);
  const lineCol = new Float32Array(edges.length * 6);
  edges.forEach((e, i) => {
    linePos.set([e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z], i * 6);
    lineCol.set([...WHITE, ...WHITE], i * 6);
  });

  return { nodePos, nodeCol, nodeScale, linePos, lineCol, edges };
}

function Field({ reduce, isMobile }: { reduce: boolean; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const net = useMemo(() => buildNetwork(isMobile), [isMobile]);

  const SIGNALS = isMobile ? 7 : 13;
  const signals = useMemo(
    () =>
      Array.from({ length: SIGNALS }, () => ({
        e: Math.floor(Math.random() * net.edges.length),
        t: Math.random(),
        sp: 0.28 + Math.random() * 0.4,
        c: Math.random() > 0.92 ? GOLD : Math.random() > 0.5 ? CYAN : VIOLET,
      })),
    [net, SIGNALS]
  );
  const sigPos = useMemo(() => new Float32Array(SIGNALS * 3), [SIGNALS]);
  const sigCol = useMemo(() => {
    const a = new Float32Array(SIGNALS * 3);
    signals.forEach((s, i) => a.set(s.c, i * 3));
    return a;
  }, [signals, SIGNALS]);
  const sigGeoRef = useRef<THREE.BufferGeometry>(null);

  const nodeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uSize: { value: isMobile ? 17 : 22 },
          uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
        },
        vertexShader: nodeVert,
        fragmentShader: nodeFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [isMobile]
  );
  const sigMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uSize: { value: isMobile ? 26 : 34 },
          uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
        },
        vertexShader: nodeVert,
        fragmentShader: nodeFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [isMobile]
  );
  const lineMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: lineVert,
        fragmentShader: lineFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const baseX = isMobile ? 0 : viewport.width * 0.16;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(
    () => () => {
      nodeMat.dispose();
      sigMat.dispose();
      lineMat.dispose();
    },
    [nodeMat, sigMat, lineMat]
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);

    // advance signals along their edges
    for (let i = 0; i < signals.length; i++) {
      const s = signals[i];
      if (!reduce) s.t += s.sp * d;
      if (s.t >= 1) {
        s.t = 0;
        s.e = Math.floor(Math.random() * net.edges.length);
      }
      const edge = net.edges[s.e];
      const ease = s.t * s.t * (3 - 2 * s.t);
      tmp.lerpVectors(edge.a, edge.b, ease);
      sigPos.set([tmp.x, tmp.y, tmp.z], i * 3);
    }
    if (sigGeoRef.current) {
      const attr = sigGeoRef.current.getAttribute('position') as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }

    const g = groupRef.current;
    if (g) {
      if (!reduce) g.rotation.y += d * 0.045;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, mouse.current.y * 0.12, 0.035);
      g.position.x = THREE.MathUtils.lerp(g.position.x, baseX + mouse.current.x * 0.3, 0.04);
      g.position.y = THREE.MathUtils.lerp(g.position.y, -mouse.current.y * 0.18, 0.04);
    }
  });

  return (
    <group ref={groupRef} position={[baseX, 0, 0]} rotation={[0.1, 0, 0]}>
      <lineSegments material={lineMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[net.linePos, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[net.lineCol, 3]} />
        </bufferGeometry>
      </lineSegments>

      <points material={nodeMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[net.nodePos, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[net.nodeCol, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[net.nodeScale, 1]} />
        </bufferGeometry>
      </points>

      <points material={sigMat}>
        <bufferGeometry ref={sigGeoRef}>
          <bufferAttribute attach="attributes-position" args={[sigPos, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[sigCol, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[new Float32Array(SIGNALS).fill(1.1), 1]} />
        </bufferGeometry>
      </points>
    </group>
  );
}

export default function NeuralField({ active = true, reduce = false }: { active?: boolean; reduce?: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  return (
    <Canvas
      className="!absolute inset-0"
      style={{ pointerEvents: 'none' }}
      frameloop={reduce ? 'demand' : active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Field reduce={reduce} isMobile={isMobile} />
    </Canvas>
  );
}
