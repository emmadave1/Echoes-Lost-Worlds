import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function NeoTokyo() {
  const carsRef = useRef<THREE.Group>(null!);

  const buildings = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const r = 10 + Math.random() * 14;
        return {
          x: Math.cos(angle) * r,
          z: Math.sin(angle) * r,
          w: 1.2 + Math.random() * 2,
          h: 6 + Math.random() * 20,
          d: 1.2 + Math.random() * 2,
          hue: Math.random() > 0.5 ? "#c47bff" : "#ff5cf0",
        };
      }),
    [],
  );

  const cars = useMemo(
    () =>
      Array.from({ length: 8 }).map(() => ({
        r: 6 + Math.random() * 10,
        y: 3 + Math.random() * 8,
        offset: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
      })),
    [],
  );

  useFrame((state) => {
    if (carsRef.current) {
      carsRef.current.children.forEach((c, i) => {
        const t = state.clock.elapsedTime * cars[i].speed + cars[i].offset;
        c.position.x = Math.cos(t) * cars[i].r;
        c.position.z = Math.sin(t) * cars[i].r;
        c.rotation.y = -t + Math.PI / 2;
      });
    }
  });

  return (
    <group>
      <fog attach="fog" args={["#150425", 8, 60]} />
      <color attach="background" args={["#0a0116"]} />
      <ambientLight intensity={0.25} color="#c47bff" />
      <pointLight position={[0, 15, 0]} intensity={30} color="#ff5cf0" distance={60} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} color="#8b5cf6" />

      {/* wet ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#1a0a30" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color="#0e0620" emissive={b.hue} emissiveIntensity={0.35} roughness={0.4} metalness={0.7} />
          </mesh>
          {/* neon stripes */}
          <mesh position={[0, 0, b.d / 2 + 0.01]}>
            <planeGeometry args={[b.w * 0.6, b.h * 0.8]} />
            <meshBasicMaterial color={b.hue} transparent opacity={0.2} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Central hologram tower */}
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 16, 32]} />
        <meshStandardMaterial color="#ff5cf0" emissive="#ff5cf0" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 16, 0]}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial color="#c47bff" emissive="#c47bff" emissiveIntensity={2.4} transparent opacity={0.8} toneMapped={false} />
      </mesh>

      {/* Flying cars */}
      <group ref={carsRef}>
        {cars.map((_, i) => (
          <group key={i}>
            <mesh>
              <boxGeometry args={[0.6, 0.15, 0.25]} />
              <meshStandardMaterial color="#fff" emissive="#ff5cf0" emissiveIntensity={2} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      <Sparkles count={250} scale={[50, 25, 50]} size={2} speed={0.25} color="#ff5cf0" opacity={0.5} />
    </group>
  );
}
