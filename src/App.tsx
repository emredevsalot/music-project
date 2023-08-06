import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  //#region Timer
  const [counter, setCounter] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  useLayoutEffect(() => {
    if (timerRunning) {
      let timerId: any;

      const animate = () => {
        setCounter((c) => c + 1);
        timerId = requestAnimationFrame(animate);
      };
      timerId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(timerId);
    }
  }, [timerRunning]);
  //#endregion

  const draw = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Line
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

    // Arc
    const center = {
      x: canvas.width * 0.5,
      y: canvas.height * 0.9,
    };

    const length = end.x - start.x;

    context.beginPath();
    context.arc(center.x, center.y, length * 0.05, Math.PI, 2 * Math.PI);
    context.stroke();

    // Circle
    const arcRadius = length * 0.05;
    const distance = Math.PI;

    const x = center.x + arcRadius * Math.cos(distance);
    const y = center.y + arcRadius * Math.sin(distance);

    context.beginPath();
    context.arc(x, y, length * 0.0065, 0, 2 * Math.PI);
    context.fill();
  };

  const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      draw(canvas, context);
    }, [draw, counter]);

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
        <h3>Frame count: {counter}</h3>
      </div>
      <Canvas />
    </>
  );
}

export default App;
