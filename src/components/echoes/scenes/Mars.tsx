import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Mars() {
  const planetRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group>
      {/* Martian atmosphere */}
      <color attach="background" args={["#170805"]} />
      <fog attach="fog" args={["#35150d", 18, 90]} />

      {/* Lighting */}
      <ambientLight intensity={0.35} color="#ffb18a" />

      <directionalLight
        position={[8, 12, 5]}
        intensity={2.5}
        color="#ffd0a1"
      />

      <pointLight
        position={[0, 5, 0]}
        intensity={25}
        color="#ff5733"
        distance={35}
      />

      {/* Martian ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <circleGeometry args={[45, 96]} />

        <meshStandardMaterial
          color="#71301d"
          roughness={1}
        />
      </mesh>

      {/* Main planet-like energy core */}
      <Float speed={0.6} floatIntensity={0.25}>
        <mesh ref={planetRef} position={[0, 3, 0]}>
          <sphereGeometry args={[2, 48, 48]} />

          <meshStandardMaterial
            color="#c94b2c"
            roughness={0.85}
            emissive="#7a2112"
            emissiveIntensity={0.45}
          />
        </mesh>
      </Float>

      {/* Atmospheric ring */}
      <mesh
        ref={ringRef}
        position={[0, 3, 0]}
        rotation={[Math.PI / 2.8, 0, 0]}
      >
        <torusGeometry args={[2.8, 0.035, 12, 96]} />

        <meshStandardMaterial
          color="#ff966b"
          emissive="#e64b24"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Ancient Martian structures */}
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const radius = 8 + (index % 3) * 1.5;
        const height = 2.5 + (index % 4) * 0.7;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              height / 2,
              Math.sin(angle) * radius,
            ]}
          >
            <cylinderGeometry
              args={[0.35, 0.55, height, 8]}
            />

            <meshStandardMaterial
              color="#a84e32"
              roughness={0.95}
            />
          </mesh>
        );
      })}

      {/* Floating Martian dust */}
      <Sparkles
        count={160}
        scale={[35, 15, 35]}
        position={[0, 3, 0]}
        size={2}
        speed={0.15}
        color="#ffb38a"
        opacity={0.65}
      />
    </group>
  );
}