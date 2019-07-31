
export const lerp = function (a, b, t) {
  return a * (1 - t) + b * t;
};

export const cosine = function (a, b, t) {
  const t2 = (1 - Math.cos(t * Math.PI)) / 2;
  return a * (1 - t2) + b * t2;
};

export const cubic = function (a, b, c, d, t) {
  const t2 = t * t;
  const e0 = d - c - a + b;
  const e1 = a - b - e0;
  const e2 = c - a;
  const e3 = b;
  return e0 * t * t2 + e1 * t2 + e2 * t + e3;
};

export const catmull_rom = function (a, b, c, d, t) {
  const t2 = t * t;
  const e0 = -0.5 * a + 1.5 * b - 1.5 * c + 0.5 * d;
  const e1 = a - 2.5 * b + 2 * c - 0.5 * d;
  const e2 = -0.5 * a + 0.5 * c;
  const e3 = b;
  return e0 * t * t2 + e1 * t2 + e2 * t + e3;
};

/*
   Tension: 1 is high, 0 normal, -1 is low
   Bias: 0 is even,
         positive is towards first segment,
         negative towards the other
*/
export const hermite = function (a, b, c, d, t, tension = 0, bias = 0) {
  const t2 = t * t;
  const t3 = t2 * t;
  let m0 = (b - a) * (1 + bias) * (1 - tension) / 2;
  m0 += (c - b) * (1 - bias) * (1 - tension) / 2;
  let m1 = (c - b) * (1 + bias) * (1 - tension) / 2;
  m1 += (d - c) * (1 - bias) * (1 - tension) / 2;
  const e0 = 2 * t3 - 3 * t2 + 1;
  const e1 = t3 - 2 * t2 + t;
  const e2 = t3 - t2;
  const e3 = -2 * t3 + 3 * t2;
  return e0 * b + e1 * m0 + e2 * m1 + e3 * c;
};
