import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Stars, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { type PortalId } from "./portals.config";
import type { Stage } from "./EchoesApp";
import Museum from "./scenes/Museum";
import Atlantis from "./scenes/Atlantis";
import NeoTokyo from "./scenes/NeoTokyo";
import Verdantis from "./scenes/Verdantis";
import Celestia from "./scenes/Celestia";
import Unknown from "./scenes/Unknown";
import CameraRig from "./CameraRig";
import { useSettings } from "./settings";

type Props = {
  stage: Stage;
  activePortal: PortalId | null;
  hovered: PortalId | null;
  onHoverPortal: (id: PortalId | null) => void;
  onEnterPortal: (id: PortalId) => void;
  onBegin: () => void;
};

export default function Scene3D({ stage, activePortal, hovered, onHoverPortal, onEnterPortal }: Props) {
  const { reduceMotion } = useSettings();

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 4, 22], fov: 55, near: 0.1, far: 400 }}
    >
      <color attach="background" args={["#04050a"]} />
      <fog attach="fog" args={["#04050a", 40, 140]} />

      <Suspense fallback={null}>
        <CameraRig stage={stage} activePortal={activePortal} />

        <ambientLight intensity={0.25} />
        <hemisphereLight args={["#8ab4ff", "#1a0f2b", 0.4]} />

        <Stars
          radius={200}
          depth={60}
          count={reduceMotion ? 1000 : 2500}
          factor={5}
          saturation={0}
          fade
          speed={reduceMotion ? 0.1 : 0.6}
        />

        {!reduceMotion && (
          <Sparkles count={80} scale={[60, 30, 60]} size={2} speed={0.2} opacity={0.5} color="#ffe9a8" />
        )}

        {(stage === "intro" || stage === "museum" || stage === "ending") && (
          <Museum
            hovered={hovered}
            onHoverPortal={onHoverPortal}
            onEnterPortal={onEnterPortal}
            interactive={stage === "museum"}
            stage={stage}
          />
        )}

        {stage === "scene" && activePortal === "atlantis" && <Atlantis />}
        {stage === "scene" && activePortal === "neotokyo" && <NeoTokyo />}
        {stage === "scene" && activePortal === "verdantis" && <Verdantis />}
        {stage === "scene" && activePortal === "celestia" && <Celestia />}
        {stage === "scene" && activePortal === "unknown" && <Unknown />}

        <Environment preset="night" />
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={reduceMotion ? 0.5 : 1.2}
          luminanceThreshold={reduceMotion ? 0.3 : 0.15}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={reduceMotion ? [0, 0] : [0.0008, 0.0008]}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.2} darkness={reduceMotion ? 0.6 : 0.85} />
      </EffectComposer>
    </Canvas>
  );
}
