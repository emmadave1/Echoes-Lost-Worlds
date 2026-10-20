import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Unknown() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const cubes = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 26,
        ),
        rot: new THREE.Euler(Math.random(), Math.random(), Math.random()),
        s: 0.6 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.05 + mouse.x * 0.002;
      groupRef.current.rotation.x = -mouse.y * 0.2;
      groupRef.current.children.forEach((c, i) => {
        const t = state.clock.elapsedTime + cubes[i].phase;
        c.position.y = cubes[i].pos.y + Math.sin(t * 0.8) * 0.6;
        c.rotation.x += dt * 0.1;
        c.rotation.y += dt * 0.15;
      });
    }
  });

  return (
    <group>
      <fog attach="fog" args={["#0a0a12", 12, 60]} />
      <color attach="background" args={["#050508"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={40} color="#e0e6ff" distance={40} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />

      <group ref={groupRef}>
        {cubes.map((c, i) => (
          <mesh key={i} position={c.pos} rotation={c.rot}>
            <boxGeometry args={[c.s, c.s, c.s]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#c9d0ff"
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Central mystery */}
      <mesh position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.6, 0.4, 128, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0e6ff" emissiveIntensity={2.4} metalness={1} roughness={0.05} toneMapped={false} />
      </mesh>

      <Sparkles count={400} scale={[40, 30, 40]} size={2} speed={0.35} color="#ffffff" opacity={0.8} />
    </group>
  );
}
