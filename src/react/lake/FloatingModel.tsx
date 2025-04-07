import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { getWaveHeight } from "./utils/wave";
import { Model } from "./Model";

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

export function FloatingModel({ time }: { time: number }) {
  const modelRef = useRef<THREE.Group>(null);

  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 2, 0],
    args: [4, 4, 4],
    angularDamping: 0.9,
    linearDamping: 0.9,
  }));

  // 회전 속도 저장용
  const angularVelocity = useRef(0);

  // 키 입력 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key as keyof typeof keys] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keys) keys[e.key as keyof typeof keys] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    api.position.subscribe(([x, , z]) => {
      const waveY = getWaveHeight(x, z, time);
      const bobbing = Math.sin(time * 4) * 0.6;
      const newY = waveY + bobbing + 1.5;

      const maxTurnSpeed = 0.00008; // 🔽 더 느리게 최대 회전
      const turnAcceleration = 0.0008; // 🔽 눌렀을 때 회전 증가량 줄임
      const turnFriction = 0.92; // 🔽 감속도 살짝 느리게

      if (keys.ArrowLeft) {
        angularVelocity.current += turnAcceleration;
      } else if (keys.ArrowRight) {
        angularVelocity.current -= turnAcceleration;
      } else {
        angularVelocity.current *= turnFriction;
      }

      angularVelocity.current = THREE.MathUtils.clamp(
        angularVelocity.current,
        -maxTurnSpeed,
        maxTurnSpeed
      );

      if (modelRef.current) {
        modelRef.current.rotation.y += angularVelocity.current;
      }

      // ✅ 전진/후진
      if (keys.ArrowUp || keys.ArrowDown) {
        const dir = keys.ArrowUp ? 1 : -1;

        const heading = modelRef.current?.rotation.y || 0;
        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          heading
        );
        forward.multiplyScalar(0.5 * dir);
        api.applyForce([forward.x, 0, forward.z], [0, 0, 0]);
      }

      // ✅ 파도 위 위치 유지
      api.position.set(x, newY, z);
    });
  });

  return (
    <group ref={ref as any}>
      <group ref={modelRef}>
        <Model scale={7} position-y={-1} />
      </group>
    </group>
  );
}
