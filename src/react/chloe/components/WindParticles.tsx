import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

export const WindParticles = () => {
  const particles = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 30;
      pos[i + 1] = Math.random() * -20;
      pos[i + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (particles.current) {
      const positions = particles.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(clock.elapsedTime + i) * 0.1;
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -20;
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={positions}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#a8e6ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};
