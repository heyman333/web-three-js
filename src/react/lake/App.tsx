import * as THREE from "three";
import { Suspense, useRef, useMemo } from "react";
import {
  Canvas,
  extend,
  useThree,
  useLoader,
  useFrame,
} from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Water } from "three-stdlib";
import "./styles.css";

extend({ Water });

function Ocean() {
  const ref =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, "/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      format: gl.encoding,
    }),
    [waterNormals]
  );
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
    }
  });

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
}

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 5, 100], fov: 55, near: 1, far: 20000 }}
      style={{ width: "100%", height: "100%" }}
    >
      <pointLight decay={0} position={[100, 100, 100]} />
      <pointLight decay={0.5} position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        <Ocean />
      </Suspense>
      <Sky distance={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
      <OrbitControls />
    </Canvas>
  );
}
