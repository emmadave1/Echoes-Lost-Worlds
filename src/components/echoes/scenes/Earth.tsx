import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);
  const moonRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.11;
    }

    if (atmosphereRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.015;
      atmosphereRef.current.scale.setScalar(pulse);
    }

    if (moonRef.current) {
      const angle = state.clock.elapsedTime * 0.12;
      moonRef.current.position.x = Math.cos(angle) * 5;
      moonRef.current.position.z = Math.sin(angle) * 5;
    }
  });

  return (
    <group>
      {/* Deep-space environment */}
      <color attach="background" args={["#020817"]} />
      <fog attach="fog" args={["#06162b", 25, 100]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#8bbcff" />

      <directionalLight
        position={[8, 10, 6]}
        intensity={3}
        color="#fff1d1"
      />

      <pointLight
        position={[0, 3, 0]}
        intensity={15}
        color="#328cff"
        distance={25}
      />

      {/* Earth: blue ocean */}
      <Float speed={0.5} floatIntensity={0.15}>
        <mesh ref={earthRef} position={[0, 3, 0]}>
          <sphereGeometry args={[2.5, 64, 64]} />

          <meshStandardMaterial
            color="#1675d1"
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Simplified green continents */}
        <group position={[0, 3, 0]}>
          {[
            { position: [-1.1, 0.65, 1.8] as [number, number, number], scale: [0.75, 0.35, 0.18] as [number, number, number], rotation: [0.3, -0.3, -0.4] as [number, number, number] },
            { position: [-0.7, -0.8, 1.8] as [number, number, number], scale: [0.35, 0.7, 0.16] as [number, number, number], rotation: [0.2, 0.1, -0.3] as [number, number, number] },
            { position: [0.9, 0.5, 1.9] as [number, number, number], scale: [0.45, 0.55, 0.16] as [number, number, number], rotation: [0.2, 0.4, 0.3] as [number, number, number] },
          ].map((continent, index) => (
            <mesh
              key={index}
              position={continent.position}
              rotation={continent.rotation}
              scale={continent.scale}
            >
              <sphereGeometry args={[1, 24, 24]} />

              <meshStandardMaterial
                color={index === 1 ? "#a5a85b" : "#4c9b59"}
                roughness={1}
              />
            </mesh>
          ))}
        </group>

        {/* Atmospheric glow */}
        <mesh ref={atmosphereRef} position={[0, 3, 0]}>
          <sphereGeometry args={[2.65, 48, 48]} />

          <meshBasicMaterial
            color="#48aaff"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Cloud layer */}
        <mesh ref={cloudsRef} position={[0, 3, 0]}>
          <sphereGeometry args={[2.57, 48, 48]} />

          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.16}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      </Float>

      {/* The Moon */}
      <group ref={moonRef} position={[5, 3, 0]}>
        <mesh>
          <sphereGeometry args={[0.48, 32, 32]} />

          <meshStandardMaterial
            color="#c6cbd5"
            roughness={1}
          />
        </mesh>
      </group>

      {/* Distant stars */}
      <Sparkles
        count={220}
        scale={[45, 30, 45]}
        position={[0, 4, 0]}
        size={1.8}
        speed={0.15}
        color="#c6e3ff"
        opacity={0.8}
      />
    </group>
  );
}