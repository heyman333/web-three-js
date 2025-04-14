import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import { Meshes } from "./Meshes";
import { Lights } from "./Lights";
import { Physics } from "@react-three/cannon";
import { Controls } from "./Controls";
import { useState } from "react";

export const MainCanvas = (props) => {
  const { setScore } = props;

  const [camEnabled, setCamEnabled] = useState(false);

  return (
    <Canvas
      gl={{ antialias: true }}
      shadows={"soft"}
      camera={{
        fov: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 100,
        position: [15, 15, 15],
      }}
      scene={{ background: new Color(0x000000) }}
    >
      <Physics gravity={[0, -9, 0]}>
        <Lights />
        <Meshes setCamEnabled={setCamEnabled} setScore={setScore} />
      </Physics>
      <Controls camEnabled={camEnabled} />
    </Canvas>
  );
};
