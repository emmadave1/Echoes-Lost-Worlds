import { Cloud, Clouds, Float, Sparkles } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function Celestia() {
  const islands = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const r = 9;
        return { x: Math.cos(a) * r, y: 2 + Math.sin(i) * 3, z: Math.sin(a) * r };
      }),
    [],
  );

  return (
    <group>
      <fog attach="fog" args={["#f7e5b3", 20, 70]} />
      <color attach="background" args={["#e8c98a"]} />
      <ambientLight intensity={0.7} color="#ffe9a8" />
      <directionalLight position={[10, 20, 10]} intensity={2.5} color="#fff2c7" />
      <pointLight position={[0, 15, 0]} intensity={30} color="#ffd579" distance={60} />

      {/* Cloud floor */}
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud seed={1} segments={40} bounds={[30, 4, 30]} volume={12} color="#fff8e0" position={[0, -2, 0]} />
        <Cloud seed={2} segments={30} bounds={[24, 3, 24]} volume={10} color="#ffe9a8" position={[0, 6, -10]} />
      </Clouds>

      {/* Floating islands */}
      {islands.map((p, i) => (
        <Float key={i} speed={0.6} floatIntensity={0.8}>
          <group position={[p.x, p.y, p.z]}>
            <mesh>
              <dodecahedronGeometry args={[1.4, 0]} />
              <meshStandardMaterial color="#f0d59b" roughness={0.7} />
            </mesh>
            {/* Temple */}
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshStandardMaterial color="#fff8e0" emissive="#ffd579" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, 2, 0]}>
              <coneGeometry args={[0.75, 0.9, 4]} />
              <meshStandardMaterial color="#ffd579" emissive="#ffd579" emissiveIntensity={1.2} toneMapped={false} />
            </mesh>
          </group>
        </Float>
      ))}

      {/* Central temple */}
      <Float speed={0.4} floatIntensity={1}>
        <group position={[0, 6, 0]}>
          <mesh>
            <cylinderGeometry args={[2.2, 2.8, 1.2, 16]} />
            <meshStandardMaterial color="#f0d59b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 2.4, 0]}>
            <coneGeometry args={[2.4, 3.6, 8]} />
            <meshStandardMaterial color="#ffd579" emissive="#ffd579" emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
        </group>
      </Float>

      <Sparkles count={300} scale={[60, 30, 60]} size={3} speed={0.15} color="#fff2c7" opacity={0.8} />
    </group>
  );
}
