import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshReflectorMaterial, Sparkles, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import Portal from "./Portal";
import { PORTALS, type PortalId } from "../portals.config";
import type { Stage } from "../EchoesApp";
import { useSettings } from "../settings";

type Props = {
  hovered: PortalId | null;
  onHoverPortal: (id: PortalId | null) => void;
  onEnterPortal: (id: PortalId) => void;
  interactive: boolean;
  stage: Stage;
};

const RADIUS = 14;

export default function Museum({
  hovered,
  onHoverPortal,
  onEnterPortal,
  interactive,
  stage,
}: Props) {
  const orbRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Group>(null!);
  const ring2Ref = useRef<THREE.Group>(null!);
  const { reduceMotion } = useSettings();

  const { size } = useThree();
  const isMobile = size.width < 768;

  useFrame((state, dt) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += dt * 0.2;
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
      orbRef.current.scale.setScalar(s);
    }
    if (ringRef.current) ringRef.current.rotation.y += dt * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= dt * 0.09;
  });

  const pillars = useMemo(() => {
    const count = isMobile ? 8 : 24;
    const pillarRadius = RADIUS + 10;

    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;

      return {
        x: Math.cos(angle) * pillarRadius,
        z: Math.sin(angle) * pillarRadius,
        h: 8 + (i % 3) * 2,
      };
    });
  }, [isMobile]);

  return (
    <group>
      {/* Floor with reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[60, 96]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.9}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a12"
          metalness={0.6}
          mirror={0.6}
        />
      </mesh>

      {/* Central platform ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2.4, 96]} />
        <meshStandardMaterial
          color="#ffd579"
          emissive="#ffb347"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* Glowing central orb */}
      <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.3}>
        <mesh ref={orbRef} position={[0, 3.2, 0]}>
          <sphereGeometry args={[1.1, 64, 64]} />
          <meshStandardMaterial
            color="#fff4d0"
            emissive="#ffcf6b"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
        <pointLight position={[0, 3.2, 0]} intensity={80} color="#ffd579" distance={40} decay={2} />
      </Float>

      {/* Halo rings around orb */}
      <group ref={ringRef} position={[0, 3.2, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.2, 0.02, 12, 128]} />
          <meshStandardMaterial
            color="#ffe9a8"
            emissive="#ffd579"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>
      <group ref={ring2Ref} position={[0, 3.2, 0]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[2.9, 0.015, 12, 128]} />
          <meshStandardMaterial
            color="#e8d8ff"
            emissive="#c9b6ff"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Marble pillars */}
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, p.h / 2, p.z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.6, p.h, 24]} />
            <meshStandardMaterial color="#e9e6de" roughness={0.35} metalness={0.05} />
          </mesh>
          <mesh position={[0, p.h / 2 + 0.15, 0]}>
            <boxGeometry args={[1.6, 0.3, 1.6]} />
            <meshStandardMaterial color="#f2eee4" roughness={0.4} />
          </mesh>
          {/* pillar top gold accent light */}
          <pointLight position={[0, p.h / 2, 0]} intensity={4} distance={8} color="#ffd579" />
        </group>
      ))}

      {/* Portals */}
      {PORTALS.map((p, index) => {
        const angle = (index / PORTALS.length) * Math.PI * 2;

        const x = Math.cos(angle) * RADIUS;
        const z = Math.sin(angle) * RADIUS;

        return (
          <Portal
            key={p.id}
            portal={p}
            position={[x, 2.6, z]}
            hovered={hovered === p.id}
            interactive={interactive}
            onHover={(h) => onHoverPortal(h ? p.id : null)}
            onEnter={() => onEnterPortal(p.id)}
          />
        );
      })}

      {/* Floor dust */}
      <Sparkles
        count={reduceMotion ? 60 : 200}
        scale={[40, 6, 40]}
        position={[0, 2, 0]}
        size={2}
        speed={reduceMotion ? 0.05 : 0.15}
        color="#fff8e0"
        opacity={0.5}
      />

      {/* Title text in intro */}
      {stage === "intro" && (
        <group position={[0, 8, -6]}>
          <Text
            fontSize={2.6}
            color="#ffe9a8"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
          >
            ECHOES
          </Text>
          <Text
            position={[0, -1.6, 0]}
            fontSize={0.35}
            color="#cfd6ff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.4}
          >
            THE MUSEUM OF LOST CIVILIZATIONS
          </Text>
        </group>
      )}
    </group>
  );
}
