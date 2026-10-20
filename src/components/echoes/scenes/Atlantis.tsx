import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Atlantis() {
  const causticsRef = useRef<THREE.Mesh>(null!);
  const bubblesRef = useRef<THREE.Group>(null!);

  const pillars = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 8 + (i % 3) * 1.5;
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, h: 6 + (i % 4) * 1.2, tilt: (i % 2 ? 0.1 : -0.08) };
      }),
    [],
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        x: (Math.random() - 0.5) * 30,
        y: Math.random() * -6,
        z: (Math.random() - 0.5) * 30,
        s: 0.1 + Math.random() * 0.3,
        speed: 0.4 + Math.random() * 0.8,
      })),
    [],
  );

  useFrame((state, dt) => {
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((c, i) => {
        c.position.y += bubbles[i].speed * dt;
        if (c.position.y > 10) c.position.y = -6;
      });
    }
  });

  return (
    <group>
      <fog attach="fog" args={["#062038", 10, 55]} />
      <color attach="background" args={["#031326"]} />
      <ambientLight intensity={0.4} color="#7fc7ff" />
      {/* God rays from above */}
      <directionalLight position={[5, 20, 5]} intensity={3} color="#a8dfff" />
      <pointLight position={[0, 8, 0]} intensity={40} color="#4aa3ff" distance={40} />

      {/* Water surface above */}
      <mesh position={[0, 14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80, 32, 32]} />
        <meshStandardMaterial color="#4aa3ff" transparent opacity={0.15} emissive="#4aa3ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Sandy floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#1a3d55" roughness={1} />
      </mesh>

      {/* Ruined pillars */}
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, p.h / 2, p.z]} rotation={[p.tilt, 0, p.tilt]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.5, p.h, 16]} />
            <meshStandardMaterial color="#7ea9c4" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Central ruin */}
      <Float speed={0.5} floatIntensity={0.3}>
        <mesh position={[0, 3, 0]}>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial color="#a3d8ff" emissive="#4aa3ff" emissiveIntensity={1.4} toneMapped={false} roughness={0.3} />
        </mesh>
      </Float>

      {/* Bubbles */}
      <group ref={bubblesRef}>
        {bubbles.map((b, i) => (
          <mesh key={i} position={[b.x, b.y, b.z]}>
            <sphereGeometry args={[b.s, 12, 12]} />
            <meshStandardMaterial color="#cceeff" transparent opacity={0.5} emissive="#7ec8ff" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      <Sparkles count={200} scale={[40, 15, 40]} size={2} speed={0.2} color="#a8dfff" opacity={0.7} />
    </group>
  );
}
