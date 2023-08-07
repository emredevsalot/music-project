export const colors: string[] = [
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

export const settings = {
  tau: 2 * Math.PI,
  maxLoops: Math.max(colors.length, 40), // Maximum loop amount the fastest element will make. (Must be above colors.length)
  realignDuration: 600, // Total time for all dots to realign at the starting point
  audioVolume: 0.2,
};
