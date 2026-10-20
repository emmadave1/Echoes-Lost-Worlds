import { Sparkles, Float } from "@react-three/drei";
import { useMemo } from "react";

export default function Verdantis() {
  const trees = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 8 + (i % 3) * 3;
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, h: 10 + Math.random() * 10, s: 1 + Math.random() * 0.6 };
      }),
    [],
  );

  return (
    <group>
      <fog attach="fog" args={["#0a2015", 10, 60]} />
      <color attach="background" args={["#04120a"]} />
      <ambientLight intensity={0.35} color="#a8ffcf" />
      <directionalLight position={[8, 20, 6]} intensity={2} color="#c8ffdb" />
      <pointLight position={[0, 10, 0]} intensity={30} color="#6bffb0" distance={50} />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#0a2415" roughness={1} />
      </mesh>

      {/* Trees as glowing cones */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 4, 12]} />
            <meshStandardMaterial color="#3a2a1a" roughness={1} />
          </mesh>
          <Float speed={0.6} floatIntensity={0.4}>
            <mesh position={[0, 4 + t.h / 2, 0]} scale={t.s}>
              <coneGeometry args={[3, t.h, 16]} />
              <meshStandardMaterial color="#1e6b3a" emissive="#6bffb0" emissiveIntensity={0.8} toneMapped={false} />
            </mesh>
          </Float>
        </group>
      ))}

      {/* Central glowing tree */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.6, 1, 12, 16]} />
        <meshStandardMaterial color="#2a1a0a" roughness={1} />
      </mesh>
      <Float speed={0.5} floatIntensity={0.6}>
        <mesh position={[0, 14, 0]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshStandardMaterial color="#4dffa0" emissive="#6bffb0" emissiveIntensity={1.6} toneMapped={false} transparent opacity={0.85} />
        </mesh>
      </Float>

      {/* Fireflies */}
      <Sparkles count={400} scale={[40, 18, 40]} size={4} speed={0.3} color="#a8ffcf" opacity={0.9} />
    </group>
  );
}
