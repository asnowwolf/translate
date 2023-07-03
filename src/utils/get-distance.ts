export function getDistance(a: number[], b: number[]): number {
  return 1 - a.reduce((acc, v, i) => acc + v * b[i], 0) /
    (Math.sqrt(a.reduce((acc, v) => acc + v ** 2, 0)) * Math.sqrt(b.reduce((acc, v) => acc + v ** 2, 0)));
}
