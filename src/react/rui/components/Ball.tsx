import { useSphere } from '@react-three/cannon';
import { Sphere } from '@react-three/drei';
import { Mesh } from 'three';

export const Ball = () => {
  const [sphere_ref] = useSphere<Mesh>(() => ({
    args: [0.5],
    mass: 1,
    position: [0, 10, 0],
    material: {
      restitution: 0.2, // 탄성력(잘 튕기는 정도)
      friction: 0.8, //마찰력(마찰이 큰 정도)
    },
  }));

  return (
    <Sphere ref={sphere_ref}>
      <meshStandardMaterial color={0x9000ff} roughness={0.3} metalness={0.8} />
    </Sphere>
  );
};
