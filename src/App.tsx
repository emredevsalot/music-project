import { useEffect, useRef, useState } from "react";
import "./App.css";

const colors = [
  "#FAF0CA",
  "#F4D35E",
  "#EE964B",
  "#F95738",
  "#EE964B",
  "#F4D35E",
  "#FAF0CA",
  "#F4D35E",
  "#EE964B",
];

const settings = {
  tau: 2 * Math.PI,
  maxLoops: Math.max(colors.length, 60), // Maximum loop amount the fastest element will make. (Must be above colors.length)
  realignDuration: 600, // Total time for all dots to realign at the starting point
  audioVolume: 0.2,
};

const playTestAudio = () => {
  const audio = new Audio(`/key1.mp3`);
  audio.volume = settings.audioVolume;
  audio.play();
};

const calculateNextImpactTime = (
  currentImpactTime: number,
  velocity: number
) => {
  return currentImpactTime + Math.PI / velocity;
};

const arcs = colors.map((color, index) => {
  const audio = new Audio(`/key${index + 1}.mp3`);
  audio.volume = settings.audioVolume;

  const numberOfLoops = settings.tau * (settings.maxLoops - index);
  const velocity = numberOfLoops / settings.realignDuration;
  const nextImpactTime = calculateNextImpactTime(0, velocity);
  return {
    color,
    audio,
    velocity,
    nextImpactTime,
  };
});

function App() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  useEffect(() => {
    document.onvisibilitychange = () => setSoundEnabled(false);
  }, []);

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

    //#region Arcs & Circles
    const lineLength = end.x - start.x;
    const mostInnerArcRadius = lineLength * 0.05;
    const spacing = (lineLength / 2 - mostInnerArcRadius) / arcs.length;

    arcs.forEach((arc, index) => {
      //#region Arc
      const arcRadius = mostInnerArcRadius + index * spacing;

      const center = {
        x: canvas.width * 0.5,
        y: canvas.height * 0.9,
      };

      context.beginPath();
      context.strokeStyle = arc.color;
      context.arc(center.x, center.y, arcRadius, Math.PI, 2 * Math.PI);
      context.stroke();
      //#endregion

      //#region Circle
      const distance = Math.PI + time * arc.velocity;
      const modDistance = distance % settings.tau;
      const adjustedDistance =
        modDistance >= Math.PI ? modDistance : settings.tau - modDistance;

      const x = center.x + arcRadius * Math.cos(adjustedDistance);
      const y = center.y + arcRadius * Math.sin(adjustedDistance);

      context.beginPath();

      context.fillStyle = arc.color;

      context.arc(x, y, lineLength * 0.025, 0, 2 * Math.PI);
      context.fill();

      if (index === 0) {
        console.log("Time: ", time.toFixed(2));
        console.log("arc.nextImpactTime", arc.nextImpactTime);
      }

      if (time >= arc.nextImpactTime) {
        if (soundEnabled) {
          arc.audio.play();
        }
        arc.nextImpactTime = calculateNextImpactTime(
          arc.nextImpactTime,
          arc.velocity
        );
      }
      //#endregion
    });
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
        <button onClick={toggleTimer}>{timerRunning ? "Stop" : "Start"}</button>
        <button onClick={toggleSound}>
          {soundEnabled ? "Mute" : "Unmute"}
        </button>
        <button onClick={playTestAudio}>Test Audio</button>
        <Timer />
      </div>
      <Canvas />
    </>
  );
}

export default App;
