import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [timerRunning, setTimerRunning] = useState(false);

  const useAnimationFrame = (callback: any) => {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef<any>();
    const previousTimeRef = useRef();

    const animate = (time: any) => {
      if (previousTimeRef.current != undefined && timerRunning) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }, []); // Make sure the effect runs only once
  };

  const [time, setTime] = useState(0);
  const Timer = () => {
    useAnimationFrame((deltaTime: any) => {
      // Pass on a function to the setter of the state
      // to make sure we always have the latest state
      setTime((prevTime) => prevTime + deltaTime * 0.002);
    });

    return <div>{Math.round(time)}</div>;
  };

  const draw = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    //#region Line
    const start = {
      x: canvas.width * 0.1,
      y: canvas.height * 0.9,
    };
    const end = {
      x: canvas.width * 0.9,
      y: canvas.height * 0.9,
    };

    context.strokeStyle = "white";
    context.fillStyle = "white";
    context.lineWidth = 6;

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    //#endregion

    //#region Arc
    const center = {
      x: canvas.width * 0.5,
      y: canvas.height * 0.9,
    };

    const length = end.x - start.x;

    context.beginPath();
    context.arc(center.x, center.y, length * 0.05, Math.PI, 2 * Math.PI);
    context.stroke();
    //#endregion

    //#region Circle
    const arcRadius = length * 0.05;
    const velocity = 1;
    const maxAngle = 2 * Math.PI;
    const distance = Math.PI + time * velocity;
    const modDistance = distance % maxAngle;
    const adjustedDistance =
      modDistance >= Math.PI ? modDistance : maxAngle - modDistance;

    const x = center.x + arcRadius * Math.cos(adjustedDistance);
    const y = center.y + arcRadius * Math.sin(adjustedDistance);

    context.beginPath();
    context.arc(x, y, length * 0.0065, 0, 2 * Math.PI);
    context.fill();
    //#endregion
  };

  const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      draw(canvas, context);
    }, [draw]);

    return (
      <canvas className="h-screen w-screen bg-slate-900" ref={canvasRef} />
    );
  };

  return (
    <>
      <div className="absolute text-white flex gap-4">
        <button onClick={() => setTimerRunning(!timerRunning)}>
          {timerRunning ? "Stop" : "Start"}
        </button>
        <Timer />
      </div>
      <Canvas />
    </>
  );
}

export default App;
