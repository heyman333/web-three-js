import { useBox } from "@react-three/cannon";

export const Wall = ({ position, rotation, opacity, length }) => {
  const [ref] = useBox(() => ({
    args: [length, 1.3, 0.5], // 길이, 높이, 두께
    position,
    rotation,
    type: "Static",
    material: {
      restitution: 1, // 반발력
      friction: 0.05,
    },
  }));

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[length, 1.3, 0.5]} />
      <meshStandardMaterial color="#888" transparent opacity={opacity / 100} />
    </mesh>
  );
};
