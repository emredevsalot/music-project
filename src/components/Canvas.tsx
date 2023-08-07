import { useEffect, useRef } from "react";

export default function Canvas({ draw }: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    draw(canvas, context);
  }, [draw]);

  return <canvas className="h-screen w-screen bg-slate-900" ref={canvasRef} />;
}
