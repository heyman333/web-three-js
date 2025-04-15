import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Lights } from './Lights';
import { Ball } from './Ball';
import { Suspense, useState } from 'react';
import { Plane } from '@react-three/drei';
import { ACTION_NAMES, Dancer } from './Dancer';
import { Ground } from './Ground';

interface PingPong {
  is_playing: boolean;
  action_idx: number;
  count: number;
}

const DEFAULT_PING_PONG: PingPong = {
  is_playing: false,
  action_idx: 0,
  count: 0,
};

export const MainCanvas = () => {
  const [ping_pong, setPingPong] = useState<PingPong>(DEFAULT_PING_PONG);
  const { is_playing, action_idx, count } = ping_pong;

  const reset = () => {
    if (!is_playing) {
      return;
    }
    setPingPong(DEFAULT_PING_PONG);
  };

  const handleDancerCollide = () => {
    setPingPong((prev) => ({
      ...prev,
      count: prev.count + 1,
    }));
  };

  const handleStartClick = () => {
    if (is_playing) {
      return;
    }
    setPingPong((prev) => ({
      ...prev,
      is_playing: true,
      action_idx: Math.floor(Math.random() * ACTION_NAMES.length),
    }));
  };

  return (
    <div className='canvas-container'>
      <Canvas
        gl={{ antialias: true }}
        camera={{
          fov: 50,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 2000,
          position: [0, 0, 20],
        }}
        shadows='soft'
        scene={{ background: new THREE.Color('black') }}
        onPointerMissed={reset}
      >
        <Physics
          iterations={20}
          tolerance={0.0001}
          defaultContactMaterial={{
            contactEquationRelaxation: 1,
            contactEquationStiffness: 1e7,
            friction: 0.9,
            frictionEquationRelaxation: 2,
            frictionEquationStiffness: 1e7,
            restitution: 0.7,
          }}
          gravity={[0, -40, 0]}
          allowSleep={false}
        >
          <Lights />
          <Plane args={[1000, 1000]} position={[0, 0, -10]} receiveShadow>
            <meshPhongMaterial color={0xfefefe} />
          </Plane>
          <Suspense fallback={null}>
            <Dancer is_playing={is_playing} action_idx={action_idx} onDancerCollide={handleDancerCollide} />
          </Suspense>
          {is_playing && <Ball />}
          <Ground onGroundCollide={reset} />
        </Physics>
      </Canvas>
      {!is_playing && (
        <button className='playing-btn' onClick={handleStartClick}>
          시작
        </button>
      )}
      <span className='playing-count'>점수 : {count}</span>
    </div>
  );
};
