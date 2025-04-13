export const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.5 * Math.PI} />
      <pointLight decay={0} intensity={Math.PI} position={[-10, -10, -10]} />
      <spotLight
        angle={0.3}
        castShadow
        decay={0}
        intensity={Math.PI}
        penumbra={1}
        position={[0, 5, 20]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </>
  );
};
