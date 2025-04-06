import * as THREE from "three";
import { Suspense, useRef, useMemo, useState } from "react";
import {
  Canvas,
  extend,
  useThree,
  useLoader,
  useFrame,
} from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Water } from "three-stdlib";
import { Physics } from "@react-three/cannon";
import "./styles.css";
import { FloatingModel } from "./FloatingModel";

extend({ Water });

function Ocean({ onUpdateTime }: { onUpdateTime: (time: number) => void }) {
  const ref =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, "/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 256, // 낮추면 더 거친 느낌
      textureHeight: 256,
      waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1), // 빛 강조
      sunColor: 0xffffff,
      waterColor: 0x000a0f, // 더 어두운 바다색
      distortionScale: 20, // 🔥 파도 왜곡 강하게
      fog: true,
      format: gl.encoding,
    }),
    [waterNormals]
  );
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
      onUpdateTime(ref.current.material.uniforms.time.value);
    }
  });

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
}

export default function App() {
  const [time, setTime] = useState(0);
  return (
    <Canvas
      camera={{ position: [0, 55, 100], fov: 55, near: 1, far: 20000 }}
      style={{ width: "100%", height: "100%" }}
    >
      <pointLight decay={0} position={[100, 100, 100]} />
      <pointLight decay={0.5} position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <Ocean onUpdateTime={setTime} />
          <FloatingModel time={time} />
        </Physics>
      </Suspense>
      <Sky distance={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
      <OrbitControls />
    </Canvas>
  );
}
