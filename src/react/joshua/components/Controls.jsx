import { OrbitControls } from "@react-three/drei";

export const Controls = (props) => {
  const { camEnabled } = props;

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.03}
      enableZoom
      enablePan
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 4}
      enableRotate={camEnabled}
    />
  );
};
