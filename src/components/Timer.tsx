import { useAnimationFrame } from "../hooks/useAnimationFrame";

export default function Timer({
  deltaTimeSetter,
  timerRunning,
}: TimerProps): null {
  useAnimationFrame((deltaTime: number) => {
    deltaTimeSetter((prevTime) => prevTime + deltaTime * 0.001);
  }, timerRunning);
  return null;
}
