import { useEffect, useState } from "react";
import "./App.css";
import { colors, settings } from "./utils/constants";
import { calculateNextImpactTime, playTestAudio } from "./utils/helpers";
import Canvas from "./components/Canvas";
import useTimer from "./hooks/useTimer";

const arcs: Arc[] = colors.map((color, index) => {
  const audio = new Audio(`./key${index + 1}.mp3`);
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
  const [time, setTime] = useState(0);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  useEffect(() => {
    document.onvisibilitychange = () => setSoundEnabled(false);
  }, []);

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

  useTimer(timerRunning, setTime);

  return (
    <>
      <div className="absolute text-white flex gap-4">
        <button onClick={toggleTimer}>{timerRunning ? "Stop" : "Start"}</button>
        <button onClick={toggleSound}>
          {soundEnabled ? "Mute" : "Unmute"}
        </button>
        <button onClick={playTestAudio}>Test Audio</button>
        {/* <Timer deltaTimeSetter={setTime} timerRunning={timerRunning} /> */}
        <div>{Math.round(time)}</div>
      </div>
      <Canvas draw={draw} />
    </>
  );
}

export default App;
