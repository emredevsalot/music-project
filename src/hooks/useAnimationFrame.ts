import { useRef, useEffect } from "react";

export const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  timerRunning: boolean
) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const animate = (time: number): void => {
    if (previousTimeRef.current !== null && timerRunning) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return (): void => cancelAnimationFrame(requestRef.current!);
  }, [timerRunning]);
};
