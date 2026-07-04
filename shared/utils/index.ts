//取中间值
export function clamp(min: number, x: number, max: number) {
  const mid = x > min ? x : min;
  return mid < max ? mid : max;
}
