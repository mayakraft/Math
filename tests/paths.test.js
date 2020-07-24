const math = require("../math");

test("segment", () => {
  expect(math.segment(1, 2, 3, 4).svgPath()).toBe("M1 2L3 4");
});

test("line", () => {
  // expect(math.line(1, 2).svgPath()).toBe("M-1000 -2000l2000 4000");
});

test("ray", () => {
  // expect(math.ray(1, 2).svgPath()).toBe("M0 0l1000 2000");
});

test("rect", () => {
  expect(math.rect(1, 2).svgPath()).toBe("M0 0L1 0L1 2L0 2z");
});

test("circle", () => {
  expect(math.circle(4).svgPath()).toBe("M4 0A4 4 0 0 1 -4 0A4 4 0 0 1 4 0");
});

test("ellipse", () => {
  expect(math.ellipse(1, 2).svgPath()).toBe("M1 0A1 2 0 0 1 -1 0A1 2 0 0 1 1 0");
});
