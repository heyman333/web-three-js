import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

export const Balloon = () => {
  const balloonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (balloonRef.current) {
      balloonRef.current.scale.x = 1 + Math.sin(clock.elapsedTime) * 0.02;
      balloonRef.current.scale.y = 1 + Math.cos(clock.elapsedTime * 0.8) * 0.02;
    }
  });

  return (
    <mesh ref={balloonRef} position={[0, 0, 0]}>
      <sphereGeometry args={[15, 64, 64]} />
      <meshPhongMaterial
        color="#ffffff"
        transparent
        opacity={0.15}
        emissive="#a8e6ff"
        emissiveIntensity={0.3}
        wireframeLinewidth={2}
      />
      <mesh position={[0, -12, 0]}>
        <coneGeometry args={[5, 8, 32]} />
        <meshStandardMaterial color="#444149" metalness={0.7} />
      </mesh>
    </mesh>
  );
};
