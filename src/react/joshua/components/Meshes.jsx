import { useBox, useSphere } from "@react-three/cannon";
import { Box, OrbitControls, Sphere } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Wall } from "./Wall";

const PLANE_WIDTH = 28;
const PLANE_DEPTH = 14;

const MIN_SPEED = 0.3;

export const Meshes = (props) => {
  const { setCamEnabled, setScore } = props;
  const { camera, raycaster, mouse } = useThree();
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef(null);
  const spherePosition = useRef(new THREE.Vector3());

  const [isYellowBallCollided, setIsYellowBallCollided] = useState(false);
  const [isRedBallCollided, setIsRedBallCollided] = useState(false);

  const [planeRef] = useBox(() => ({
    args: [PLANE_WIDTH, 2, PLANE_DEPTH],
    type: "Static",
    position: [0, 0, 0],
    material: {
      friction: 1,
      restituion: 0.3,
    },
  }));

  const [targetBallRef, targetBallApi] = useSphere(() => ({
    mass: 1,
    args: [0.5, 32, 32],
    position: [-7, 1.5, 3],
    material: {
      restitution: 1,
      friction: 0.2,
    },
    linearDamping: 0.2,
    angularDamping: 0.2,
    onCollide: (e) => {
      if (e.body.userData.name === "yellow_ball") {
        setIsYellowBallCollided(true);
      }
      if (e.body.userData.name === "red_ball") {
        setIsRedBallCollided(true);
      }
    },
  }));

  const [yellowBallRef, yellowBallApi] = useSphere(() => ({
    mass: 1,
    args: [0.5, 32, 32],
    position: [-7, 1.5, 0],
    material: {
      restitution: 1,
      friction: 0.2,
    },
    linearDamping: 0.2,
    angularDamping: 0.2,
    userData: { name: "yellow_ball" },
  }));

  const [redBallRef, redBallApi] = useSphere(() => ({
    mass: 1,
    args: [0.5, 32, 32],
    position: [7, 1.5, 0],
    material: {
      restitution: 1,
      friction: 0.2,
    },
    linearDamping: 0.2,
    angularDamping: 0.2,
    userData: { name: "red_ball" },
  }));

  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.5),
    []
  ); // XZ 평면

  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  // 공 위치 추적
  useEffect(() => {
    const unsubscribe = targetBallApi.position.subscribe((p) => {
      spherePosition.current.set(p[0], p[1], p[2]);
    });

    const handlePointerDown = () => {
      setIsYellowBallCollided(false);
      setIsRedBallCollided(false);

      raycaster.setFromCamera(mouse, camera);
      if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        const dist = intersectPoint.distanceTo(spherePosition.current);

        if (dist < 1.5) {
          dragStart.current = intersectPoint.clone();
          setIsDragging(true);
        }
      }
    };

    const handlePointerUp = () => {
      if (!isDragging || !dragStart.current) return;

      raycaster.setFromCamera(mouse, camera);
      if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        const dragEnd = intersectPoint.clone();

        const force = new THREE.Vector3()
          .subVectors(dragStart.current, dragEnd) // 방향: 반대로
          .setY(0) // Y축 제거
          .multiplyScalar(7.5); // 세기 조절

        targetBallApi.applyImpulse([force.x, 0, force.z], [0, 0, 0]);
      }

      dragStart.current = null;
      setIsDragging(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      unsubscribe();
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    camera,
    intersectPoint,
    isDragging,
    mouse,
    plane,
    raycaster,
    targetBallApi,
    targetBallApi.position,
    spherePosition,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        setCamEnabled(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        setCamEnabled(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (isYellowBallCollided && isRedBallCollided) {
      setScore((prev) => prev + 1);
      setIsYellowBallCollided(false);
      setIsRedBallCollided(false);
    }
  }, [isRedBallCollided, isYellowBallCollided, setScore]);

  useEffect(() => {
    const unsubscribe = targetBallApi.velocity.subscribe(([vx, vy, vz]) => {
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (speed < MIN_SPEED) {
        targetBallApi.velocity.set(0, 0, 0);
      }
    });

    const unsubscribe2 = yellowBallApi.velocity.subscribe(([vx, vy, vz]) => {
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (speed < MIN_SPEED) {
        yellowBallApi.velocity.set(0, 0, 0);
      }
    });

    const unsubscribe3 = redBallApi.velocity.subscribe(([vx, vy, vz]) => {
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (speed < MIN_SPEED) {
        redBallApi.velocity.set(0, 0, 0);
      }
    });

    return () => {
      unsubscribe();
      unsubscribe2();
      unsubscribe3();
    };
  }, [redBallApi.velocity, targetBallApi, yellowBallApi.velocity]);

  return (
    <>
      <Box args={[PLANE_WIDTH, 2, PLANE_DEPTH]} ref={planeRef}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Sphere ref={targetBallRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="white" />
      </Sphere>

      <Sphere ref={yellowBallRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="yellow" />
      </Sphere>

      <Sphere ref={redBallRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="red" />
      </Sphere>

      <Wall
        position={[0, 1, -PLANE_DEPTH / 2]}
        rotation={[0, 0, 0]}
        opacity={100}
        length={PLANE_WIDTH}
      />
      <Wall
        position={[0, 1, PLANE_DEPTH / 2]}
        rotation={[0, Math.PI, 0]}
        opacity={100}
        length={PLANE_WIDTH}
      />
      <Wall
        position={[-PLANE_WIDTH / 2, 1, 0]}
        rotation={[0, Math.PI / 2, 0]}
        opacity={100}
        length={PLANE_DEPTH}
      />
      <Wall
        position={[PLANE_WIDTH / 2, 1, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        opacity={100}
        length={PLANE_DEPTH}
      />
    </>
  );
};
