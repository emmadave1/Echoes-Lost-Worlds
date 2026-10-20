import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import type { Stage } from "./EchoesApp";
import { getPortal, type PortalId } from "./portals.config";
import { useSettings } from "./settings";

type Props = { stage: Stage; activePortal: PortalId | null };

const MUSEUM_RADIUS = 12;

export default function CameraRig({ stage, activePortal }: Props) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 2, 0));
  const mouse = useRef({ x: 0, y: 0 });
  const { reduceMotion } = useSettings();
  const reduceMotionRef = useRef(reduceMotion);
  reduceMotionRef.current = reduceMotion;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const rm = reduceMotionRef.current;
    const d = (v: number) => (rm ? Math.min(v, 1.2) : v);
    const ease = rm ? "power1.inOut" : "power3.inOut";

    if (stage === "intro") {
      gsap.to(camera.position, { x: 0, y: 6, z: 30, duration: d(2.4), ease });
      target.current.set(0, 3, 0);
    } else if (stage === "museum") {
      gsap.to(camera.position, { x: 0, y: 7, z: 24, duration: d(2.6), ease });
      target.current.set(0, 3, 0);
    } else if (stage === "scene" && activePortal) {
      const p = getPortal(activePortal);
      const x = Math.cos(p.angle) * MUSEUM_RADIUS;
      const z = Math.sin(p.angle) * MUSEUM_RADIUS;
      if (rm) {
        // No flythrough — soft cut
        gsap.to(camera.position, { x: 0, y: 3, z: 12, duration: 0.9, ease: "power2.out" });
      } else {
        gsap.to(camera.position, {
          x: x * 1.4,
          y: 3,
          z: z * 1.4,
          duration: 1.6,
          ease: "power4.in",
          onComplete: () => {
            camera.position.set(0, 3, 12);
          },
        });
      }
    } else if (stage === "ending") {
      gsap.to(camera.position, { x: 0, y: 6, z: 8, duration: d(3), ease });
      target.current.set(0, 4, 0);
    }
  }, [stage, activePortal, camera]);

  useFrame(() => {
    const rm = reduceMotionRef.current;
    const px = mouse.current.x * (rm ? 0.15 : 0.6);
    const py = -mouse.current.y * (rm ? 0.08 : 0.3);
    const desired = new THREE.Vector3(target.current.x + px, target.current.y + py, target.current.z);
    camera.lookAt(desired);
  });

  return null;
}
