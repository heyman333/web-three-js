import { Canvas } from '@react-three/fiber';
import { Controls } from './Controls';
import * as THREE from 'three';
import { Physics } from '@react-three/cannon';
import { Dancer } from './Dancer';
import { Lights } from './Lights';
import { Meshes } from './Meshes';

export const MainCanvas = () => {
  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{
        fov: 80,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000,
        position: [5, 5, 5],
      }}
      shadows={'soft'}
      scene={{ background: new THREE.Color('black') }}
    >
      <Physics gravity={[0, -9, 0]} defaultContactMaterial={{ restitution: 0.1, friction: 1 }}>
        <Controls />
        <Lights />
        <Meshes />
        <Dancer />
      </Physics>
    </Canvas>
  );
};
