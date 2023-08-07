import { useEffect } from "react";

export default function useTimer(
  timerRunning: boolean,
  deltaTimeSetter: React.Dispatch<React.SetStateAction<number>>
): void {
  useEffect(() => {
    let previousTime = performance.now();
    let animationFrame: number;

    const animate = (): void => {
      if (timerRunning) {
        const currentTime = performance.now();
        const deltaTime = currentTime - previousTime;
        previousTime = currentTime;
        deltaTimeSetter((prevTime) => prevTime + deltaTime * 0.001);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    if (timerRunning) {
      animate();
    }

    return (): void => {
      cancelAnimationFrame(animationFrame);
    };
  }, [timerRunning, deltaTimeSetter]);
}
