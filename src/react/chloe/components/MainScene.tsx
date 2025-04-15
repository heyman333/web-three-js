import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import React from "react";
import { Balloon } from "./Balloon";
import { BalloonCollider } from "./BalloonCollider";
import { WindBall } from "./WindBall";
import { PhysicsContextSetup } from "./PhysicsContextSetup";

export const MainScene = () => {
  return (
    <Canvas camera={{ position: [0, 20, 300], fov: 45 }} shadows>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 15, 10]} intensity={1.2} />

      <Physics gravity={[0, -9.81, 0]} allowSleep={false} maxSubSteps={10}>
        <PhysicsContextSetup />
        <BalloonCollider />

        {Array.from({ length: 100 }).map((_, i) => (
          <WindBall
            key={i}
            position={[
              (Math.random() - 0.5) * 10,
              Math.random() * 5 - 5,
              (Math.random() - 0.5) * 10,
            ]}
          />
        ))}
      </Physics>

      <Balloon />
      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
