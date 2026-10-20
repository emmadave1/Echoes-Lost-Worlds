import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Saturn() {
  const planetRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);
  const ringGroupRef = useRef<THREE.Group>(null!);
  const moonsRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    // Rotate the planet.
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.06;
    }

    // Gently pulse the atmospheric shell.
    if (atmosphereRef.current) {
      const pulse =
        1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.012;

      atmosphereRef.current.scale.setScalar(pulse);
    }

    // Rotate the rings slowly.
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.y += delta * 0.025;
    }

    // Move the moons around the planet.
    if (moonsRef.current) {
      const angle = state.clock.elapsedTime * 0.12;

      moonsRef.current.children.forEach((moon, index) => {
        const orbitRadius = 5 + index * 1.1;
        const moonAngle = angle + index * ((Math.PI * 2) / 3);

        moon.position.x = Math.cos(moonAngle) * orbitRadius;
        moon.position.z = Math.sin(moonAngle) * orbitRadius;
      });
    }
  });

  return (
    <group>
      {/* Deep-space environment */}
      <color attach="background" args={["#080610"]} />
      <fog attach="fog" args={["#17101f", 30, 110]} />

      {/* Lighting */}
      <ambientLight intensity={0.45} color="#c9b99b" />

      <directionalLight
        position={[8, 12, 6]}
        intensity={2.8}
        color="#fff0c9"
      />

      <pointLight
        position={[0, 3, 0]}
        intensity={18}
        color="#f4c879"
        distance={30}
      />

      {/* Saturn's golden atmosphere */}
      <Float speed={0.4} floatIntensity={0.12}>
        <mesh ref={planetRef} position={[0, 3, 0]}>
          <sphereGeometry args={[2.7, 64, 64]} />

          <meshStandardMaterial
            color="#d8b878"
            roughness={0.9}
            metalness={0.02}
          />
        </mesh>

        {/* Atmospheric shell */}
        <mesh ref={atmosphereRef} position={[0, 3, 0]}>
          <sphereGeometry args={[2.82, 48, 48]} />

          <meshBasicMaterial
            color="#ffe1a0"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Atmospheric bands */}
        {[0, 1, 2, 3, 4].map((index) => {
          const y = 3 + (index - 2) * 0.65;
          const radius = Math.sqrt(2.7 * 2.7 - (y - 3) ** 2);

          return (
            <mesh
              key={index}
              position={[0, y, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry
                args={[radius, 0.045, 8, 96]}
              />

              <meshBasicMaterial
                color={index % 2 === 0 ? "#f3d49a" : "#a77c45"}
                transparent
                opacity={0.35}
              />
            </mesh>
          );
        })}

        {/* Saturn's rings */}
        <group
          ref={ringGroupRef}
          position={[0, 3, 0]}
          rotation={[Math.PI / 2.7, 0, 0.12]}
        >
          <mesh>
            <ringGeometry args={[3.1, 3.7, 128]} />

            <meshStandardMaterial
              color="#f2d7a0"
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
              roughness={0.8}
            />
          </mesh>

          <mesh>
            <ringGeometry args={[3.85, 4.45, 128]} />

            <meshStandardMaterial
              color="#b89b70"
              side={THREE.DoubleSide}
              transparent
              opacity={0.75}
              roughness={0.9}
            />
          </mesh>

          <mesh>
            <ringGeometry args={[4.55, 4.75, 128]} />

            <meshBasicMaterial
              color="#ffe7b8"
              side={THREE.DoubleSide}
              transparent
              opacity={0.65}
            />
          </mesh>
        </group>
      </Float>

      {/* Orbiting moons */}
      <group ref={moonsRef}>
        {[0, 1, 2].map((index) => (
          <mesh key={index}>
            <sphereGeometry
              args={[0.18 + index * 0.07, 24, 24]}
            />

            <meshStandardMaterial
              color={index === 1 ? "#a8a5a0" : "#d9c8a5"}
              roughness={1}
            />
          </mesh>
        ))}
      </group>

      {/* Distant cosmic particles */}
      <Sparkles
        count={240}
        scale={[50, 35, 50]}
        position={[0, 4, 0]}
        size={1.8}
        speed={0.12}
        color="#ffe5b5"
        opacity={0.8}
      />
    </group>
  );
}