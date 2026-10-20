import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Text, Billboard } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { PortalConfig } from "../portals.config";
import { useSettings } from "../settings";

type Props = {
  portal: PortalConfig;
  position: [number, number, number];
  hovered: boolean;
  interactive: boolean;
  onHover: (h: boolean) => void;
  onEnter: () => void;
};

const tmpVec = new THREE.Vector3();

export default function Portal({ portal, position, hovered, interactive, onHover, onEnter }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const arcRef = useRef<THREE.Mesh>(null!);
  const arc2Ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const waveRef = useRef<THREE.Mesh>(null!);
  const wave2Ref = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const burstRef = useRef<THREE.Points>(null!);
  const focusRingRef = useRef<THREE.Mesh>(null!);
  const promptGroupRef = useRef<THREE.Group>(null!);
  const promptBgRef = useRef<THREE.Mesh>(null!);
  const promptRingRef = useRef<THREE.Mesh>(null!);
  const promptTextRef = useRef<{ fillOpacity: number } | null>(null);
  const proximity = useRef(0); // 0 = far, 1 = right on
  const intensity = useRef(0); // smoothed combined

  const { pointer, camera, size } = useThree();
  const { reduceMotion } = useSettings();

  // Burst particles buffer (positions/velocities kept locally)
  const burstCount = reduceMotion ? 12 : 40;
  const burstDataRef = useRef<{ pos: Float32Array; vel: Float32Array; life: Float32Array } | null>(null);
  if (!burstDataRef.current) {
    burstDataRef.current = {
      pos: new Float32Array(burstCount * 3),
      vel: new Float32Array(burstCount * 3),
      life: new Float32Array(burstCount),
    };
  }

  useFrame((state, dt) => {
    if (groupRef.current) groupRef.current.lookAt(0, position[1], 0);

    // Compute cursor proximity to portal in screen space
    tmpVec.set(position[0], position[1], position[2]).project(camera);
    const px = (tmpVec.x + 1) / 2; // 0..1
    const py = (tmpVec.y + 1) / 2;
    const mx = (pointer.x + 1) / 2;
    const my = (pointer.y + 1) / 2;
    // Normalize by aspect so distance is not skewed
    const aspect = size.width / size.height;
    const dx = (mx - px) * aspect;
    const dy = my - py;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // proximity ramps: 0 at 0.35, 1 at 0.05
    const target = interactive ? THREE.MathUtils.clamp(1 - (dist - 0.05) / 0.3, 0, 1) : 0;
    proximity.current += (target - proximity.current) * Math.min(1, dt * 6);

    const combinedTarget = Math.max(proximity.current, hovered ? 1 : 0);
    intensity.current += (combinedTarget - intensity.current) * Math.min(1, dt * 8);
    const I = intensity.current;

    const spinBoost = reduceMotion ? 0.15 : 0.4 + I * 1.4;
    if (arcRef.current) arcRef.current.rotation.z += dt * spinBoost;
    if (arc2Ref.current) arc2Ref.current.rotation.z -= dt * (spinBoost * 0.7);

    if (glowRef.current) {
      const t = state.clock.elapsedTime * (reduceMotion ? 0.8 : 1.5);
      const s = 1 + Math.sin(t) * (reduceMotion ? 0.01 : 0.03) + I * 0.18;
      glowRef.current.scale.setScalar(s);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + I * 0.35;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 10 + I * (reduceMotion ? 12 : 40);
    }

    // Energy waves — expanding ring pulses when intensity high
    const pulseSpeed = 0.6 + I * 1.8;
    const applyWave = (mesh: THREE.Mesh | null, phase: number) => {
      if (!mesh) return;
      const t = ((state.clock.elapsedTime * pulseSpeed + phase) % 1);
      const s = 1 + t * (reduceMotion ? 0.9 : 1.6);
      mesh.scale.setScalar(s);
      const m = mesh.material as THREE.MeshBasicMaterial;
      m.opacity = Math.max(0, (1 - t) * (0.15 + I * 0.6));
    };
    applyWave(waveRef.current, 0);
    if (!reduceMotion) applyWave(wave2Ref.current, 0.5);

    // Focus ring — clearly visible when hovered/focused, strong in Calm mode
    if (focusRingRef.current) {
      const focused = hovered ? 1 : 0;
      const pulse = reduceMotion
        ? 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
        : 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.05;
      focusRingRef.current.scale.setScalar(pulse);
      const m = focusRingRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = focused * (reduceMotion ? 0.95 : 0.8) + I * 0.15;
    }

    // Activation prompt fades in with focus/hover/proximity
    if (promptGroupRef.current) {
      const promptTarget = Math.max(hovered ? 1 : 0, I > 0.55 ? 1 : 0);
      const current = promptGroupRef.current.userData.o ?? 0;
      const next = current + (promptTarget - current) * Math.min(1, dt * 8);
      promptGroupRef.current.userData.o = next;
      promptGroupRef.current.visible = next > 0.01;
      promptGroupRef.current.position.y = -3.3 + next * 0.25;
      const bgMat = promptBgRef.current?.material as THREE.MeshBasicMaterial | undefined;
      if (bgMat) bgMat.opacity = next * 0.6;
      const ringMat = promptRingRef.current?.material as THREE.MeshBasicMaterial | undefined;
      if (ringMat) ringMat.opacity = next * 0.9;
      if (promptTextRef.current) promptTextRef.current.fillOpacity = next;
    }

    // Burst particles
    const data = burstDataRef.current!;
    const geom = burstRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (geom) {
      for (let i = 0; i < burstCount; i++) {
        data.life[i] -= dt;
        if (data.life[i] <= 0 && Math.random() < I * (reduceMotion ? 0.3 : 0.9)) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * (reduceMotion ? 1 : 3);
          data.pos[i * 3] = 0;
          data.pos[i * 3 + 1] = 0;
          data.pos[i * 3 + 2] = 0;
          data.vel[i * 3] = Math.cos(angle) * speed;
          data.vel[i * 3 + 1] = Math.sin(angle) * speed;
          data.vel[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.5;
          data.life[i] = 0.6 + Math.random() * 0.6;
        }
        if (data.life[i] > 0) {
          data.pos[i * 3] += data.vel[i * 3] * dt;
          data.pos[i * 3 + 1] += data.vel[i * 3 + 1] * dt;
          data.pos[i * 3 + 2] += data.vel[i * 3 + 2] * dt;
          data.vel[i * 3] *= 0.96;
          data.vel[i * 3 + 1] *= 0.96;
          data.vel[i * 3 + 2] *= 0.96;
        } else {
          data.pos[i * 3] = data.pos[i * 3 + 1] = data.pos[i * 3 + 2] = 999;
        }
      }
      const attr = geom.getAttribute("position") as THREE.BufferAttribute;
      attr.array = data.pos;
      attr.needsUpdate = true;
    }
  });

  const color = new THREE.Color(portal.color);
  const glow = new THREE.Color(portal.glow);

  return (
    <group ref={groupRef} position={position}>
      {/* Frame */}
      <mesh>
        <torusGeometry args={[1.6, 0.08, 16, 96]} />
        <meshStandardMaterial color="#fbf6e8" emissive={glow} emissiveIntensity={0.6} metalness={0.6} roughness={0.2} toneMapped={false} />
      </mesh>

      {/* Rotating arcs */}
      <mesh ref={arcRef}>
        <torusGeometry args={[1.35, 0.02, 12, 96, Math.PI * 1.2]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <mesh ref={arc2Ref} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.2, 0.015, 12, 96, Math.PI * 0.9]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>

      {/* Interactive glow disc */}
      <mesh
        ref={glowRef}
        onPointerOver={(e) => { if (interactive) { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; } }}
        onPointerOut={() => { onHover(false); document.body.style.cursor = "auto"; }}
        onClick={(e) => { if (interactive) { e.stopPropagation(); onEnter(); } }}
      >
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Expanding energy waves */}
      <mesh ref={waveRef}>
        <ringGeometry args={[1.55, 1.7, 64]} />
        <meshBasicMaterial color={glow} transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {!reduceMotion && (
        <mesh ref={wave2Ref}>
          <ringGeometry args={[1.55, 1.65, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Focus ring — high-contrast outline when hovered or keyboard-focused */}
      <mesh ref={focusRingRef}>
        <ringGeometry args={[1.72, 1.86, 96]} />
        <meshBasicMaterial
          color="#fff4d0"
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight ref={lightRef} position={[0, 0, 0.4]} color={glow} intensity={14} distance={14} decay={2} />

      {/* Ambient sparkles */}
      <Sparkles count={reduceMotion ? 12 : 40} scale={[3.2, 3.2, 0.6]} size={2.5} speed={reduceMotion ? 0.1 : 0.4} color={portal.glow} opacity={0.9} />

      {/* Cursor-reactive burst particles */}
      <points ref={burstRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[burstDataRef.current!.pos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={glow}
          size={0.14}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Label */}
      <Billboard position={[0, -2.3, 0]}>
        <Text fontSize={0.32} color="#fff" anchorX="center" anchorY="middle" letterSpacing={0.3} outlineWidth={0}>
          {portal.name.toUpperCase()}
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.14} color="#c9d0e6" anchorX="center" anchorY="middle" letterSpacing={0.25}>
          {portal.tagline.toUpperCase()}
        </Text>
      </Billboard>

      {/* Activation prompt — appears on focus / cursor proximity */}
      <Billboard ref={promptGroupRef} position={[0, -3.3, 0]} visible={false}>
        <mesh ref={promptBgRef}>
          <planeGeometry args={[2.6, 0.42]} />
          <meshBasicMaterial color="#0b0c14" transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
        <mesh ref={promptRingRef} position={[0, 0, 0.001]}>
          <ringGeometry args={[1.28, 1.32, 64]} />
          <meshBasicMaterial color={glow} transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
        <Text
          ref={(t) => {
            promptTextRef.current = t as unknown as { fillOpacity: number } | null;
          }}
          position={[0, 0, 0.01]}
          fontSize={0.17}
          color="#ffe9a8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.35}
          fillOpacity={0}
        >
          PRESS ENTER · CLICK TO ENTER
        </Text>
      </Billboard>
    </group>
  );
}
