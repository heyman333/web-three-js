// utils/wave.ts
export function getWaveHeight(x: number, z: number, time: number) {
  const frequency = 0.1; // 물결 주기
  const amplitude = 0.1; // 물결 세기
  const speed = 0.1; // 물살 속도

  return (
    Math.sin((x + time * speed) * frequency) *
    Math.cos((z + time * speed) * frequency) *
    amplitude
  );
}
