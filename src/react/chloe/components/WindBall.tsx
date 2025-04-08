import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import React, { useEffect } from "react";
import * as THREE from "three";

export const WindBall = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const [ref, api] = useSphere(() => ({
    args: [0.5],
    position,
    linearDamping: 0.05,
    angularDamping: 0.05,
    mass: 2,
    material: "ball",
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
  }));

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    const baseWind = 0.1;
    const windForce = new THREE.Vector3(
      Math.sin(time * 1.2) * baseWind,
      Math.cos(time * 0.8) * baseWind,
      Math.sin(time * 1.0) * baseWind
    );

    const toCenter = ref.current!.position.clone().multiplyScalar(-0.3);
    windForce.add(toCenter);

    api.velocity.subscribe((vel) => {
      if (new THREE.Vector3(...vel).length() > 8) {
      }
    });

    api.applyForce(windForce.toArray(), [0, 0, 0]);
  });

  useEffect(() => {
    return api.position.subscribe((pos) => {
      if (new THREE.Vector3(...pos).length() > 15) {
        api.position.set(0, 5, 0);
        api.velocity.set(0, 0, 0);
      }
    });
  }, []);

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={"#f9f9f1"} />
    </mesh>
  );
};
