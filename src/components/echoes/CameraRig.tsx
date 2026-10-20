import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import type { Stage } from "./EchoesApp";
import { getPortal } from "./portals.config";
import { useSettings } from "./settings";

type Props = {
  stage: Stage;
  activePortal: string | null;
};

export default function CameraRig({ stage, activePortal }: Props) {
  const { camera, size } = useThree();

  const target = useRef(new THREE.Vector3(0, 2, 0));
  const mouse = useRef({ x: 0, y: 0 });

  const { reduceMotion } = useSettings();
  const reduceMotionRef = useRef(reduceMotion);

  reduceMotionRef.current = reduceMotion;

  // Detect narrow screens.
  const isMobile = size.width < 768;

  // Adjust the camera's field of view for different screen sizes.
  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    perspectiveCamera.fov = isMobile ? 68 : 55;
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, isMobile]);

  // Track mouse movement on desktop.
  useEffect(() => {
    if (isMobile) {
      mouse.current.x = 0;
      mouse.current.y = 0;
      return;
    }

    const onMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [isMobile]);

  // Move the camera according to the current application stage.
  useEffect(() => {
    const rm = reduceMotionRef.current;

    const duration = (value: number) =>
      rm ? Math.min(value, 1.2) : value;

    const ease = rm ? "power1.inOut" : "power3.inOut";

    if (stage === "intro") {
      gsap.to(camera.position, {
        x: 0,
        y: isMobile ? 7 : 6,
        z: isMobile ? 36 : 30,
        duration: duration(2.4),
        ease,
        overwrite: "auto",
      });

      target.current.set(0, 3, 0);
    } else if (stage === "museum") {
      gsap.to(camera.position, {
        x: 0,
        y: isMobile ? 8 : 7,
        z: isMobile ? 30 : 24,
        duration: duration(2.6),
        ease,
        overwrite: "auto",
      });

      target.current.set(0, 3, 0);
    } else if (stage === "scene" && activePortal) {
      // Keep the world centered instead of using the desktop fly-through
      // animation on mobile.
      gsap.to(camera.position, {
        x: 0,
        y: 3,
        z: isMobile ? 15 : 12,
        duration: rm || isMobile ? 0.8 : 1.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      target.current.set(0, 3, 0);
    } else if (stage === "ending") {
      gsap.to(camera.position, {
        x: 0,
        y: isMobile ? 6 : 6,
        z: isMobile ? 11 : 8,
        duration: duration(3),
        ease,
        overwrite: "auto",
      });

      target.current.set(0, 4, 0);
    }
  }, [stage, activePortal, camera, isMobile]);

  // Apply subtle camera movement on desktop only.
  useFrame(() => {
    const rm = reduceMotionRef.current;

    const parallaxX = isMobile
      ? 0
      : mouse.current.x * (rm ? 0.15 : 0.6);

    const parallaxY = isMobile
      ? 0
      : -mouse.current.y * (rm ? 0.08 : 0.3);

    camera.lookAt(
      target.current.x + parallaxX,
      target.current.y + parallaxY,
      target.current.z
    );
  });

  return null;
}