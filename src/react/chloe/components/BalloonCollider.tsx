import { useSphere } from "@react-three/cannon";

export const BalloonCollider = () => {
  useSphere(() => ({
    type: "Static",
    args: [14],
    position: [0, 0, 0],
    material: "boundary",
    restitution: 0.95,
    contactEquationStiffness: 1e9,
    contactEquationRelaxation: 4,
  }));

  return null;
};
