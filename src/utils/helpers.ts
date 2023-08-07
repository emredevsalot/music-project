export const calculateNextImpactTime = (
  currentImpactTime: number,
  velocity: number
) => {
  return currentImpactTime + Math.PI / velocity;
};

export const playTestAudio = () => {
  const audio = new Audio(`./key1.mp3`);
  audio.volume = 0.2;
  audio.play();
};
