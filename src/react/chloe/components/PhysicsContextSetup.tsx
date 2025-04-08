import { useContactMaterial } from "@react-three/cannon";

export const PhysicsContextSetup = () => {
  useContactMaterial("ball", "boundary", {
    restitution: 0.6,
    friction: 0.3,
    contactEquationStiffness: 1e8,
  });

  return null;
};
