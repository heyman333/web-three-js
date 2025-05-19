import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Text } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three'; // 꼭 필요함

function ScrollScene() {
  const scroll = useScroll();
  const cubeRef = useRef();
  const lakeRef = useRef();
  const sphereRef = useRef();
  const torusRef = useRef();
  const { camera, scene } = useThree();

  useEffect(() => {
    const handleScroll = () => {
      const p = scroll.offset; // 0 ~ 1

      const bgColor = new THREE.Color();
      bgColor.setHSL(p * 0.6, 0.5, 0.4); // HSL로 색상 변화 (0~1 구간)

      gsap.to(scene.background, {
        r: bgColor.r,
        g: bgColor.g,
        b: bgColor.b,
        duration: 0.5,
        ease: 'sine.inOut',
      });

      gsap.to(lakeRef.current.rotation, { z: Math.PI * p * 3, duration: 0.4 }); // 회전

      // // 텍스트 회전 및 확대
      // gsap.to(lakeRef.current.rotation, {
      //   y: visible ? Math.PI * 2 * p : 0,
      //   duration: 0.4,
      // });
      // gsap.to(lakeRef.current.scale, {
      //   x: visible ? 1 : 0,
      //   y: visible ? 1 : 0,
      //   z: visible ? 1 : 0,
      //   duration: 0.4,
      // });

      // page 0~1: 큐브 등장
      gsap.to(cubeRef.current.position, {
        x: p * 10 - 5,
        y: Math.sin(p * Math.PI) * 2,
        duration: 0.3,
        ease: 'power2.out',
      });

      // page 1~2: 구체 커지기
      gsap.to(sphereRef.current.scale, {
        x: 1 + p * 1.5,
        y: 1 + p * 1.5,
        z: 1 + p * 1.5,
        duration: 0.3,
        ease: 'sine.out',
      });

      // page 2~3: 토러스 회전
      gsap.to(torusRef.current.rotation, {
        x: p * Math.PI * 4,
        y: p * Math.PI * 2,
        duration: 0.3,
        ease: 'power1.inOut',
      });

      // page 3~4: 카메라 z 이동
      gsap.to(camera.position, {
        z: 10 + p * 10,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    scroll.el.addEventListener('scroll', handleScroll);
    return () => scroll.el.removeEventListener('scroll', handleScroll);
  }, [scroll, camera]);

  return (
    <>
      <mesh ref={cubeRef} position={[-2, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>

      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color='skyblue' />
      </mesh>

      <mesh ref={torusRef} position={[2, 0, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 100]} />
        <meshStandardMaterial color='pink' />
      </mesh>

      <Text
        ref={lakeRef}
        fontSize={11}
        position={[0, 0, -10]}
        color='rgb(93, 144, 18)'
        anchorX='center'
        anchorY='middle'
      >
        Lake
      </Text>
    </>
  );
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <color attach='background' args={['black']} /> {/* 초기 배경색 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <ScrollControls pages={5} damping={0.2}>
        <ScrollScene />
      </ScrollControls>
    </Canvas>
  );
}

export default function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Scene />
    </div>
  );
}
