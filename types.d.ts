interface Arc {
  color: string;
  audio: HTMLAudioElement;
  velocity: number;
  nextImpactTime: number;
}

interface TimerProps {
  deltaTimeSetter: React.Dispatch<React.SetStateAction<number>>;
  timerRunning: boolean;
}

interface CanvasProps {
  draw: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
}

interface Settings {
  tau: number;
  maxLoops: number;
  realignDuration: number;
  audioVolume: number;
}
