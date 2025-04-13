import { usePlane } from '@react-three/cannon';
import { FC } from 'react';

interface Props {
  onGroundCollide?: () => void;
}

export const Ground: FC<Props> = ({ onGroundCollide }) => {
  const [ref] = usePlane(() => ({
    onCollide: onGroundCollide,
    position: [0, -10, 0],
    rotation: [-Math.PI / 2, 0, 0],
    type: 'Static',
  }));

  return <mesh ref={ref} receiveShadow />;
};
