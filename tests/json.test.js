const math = require("../math");

test("vector", () => {
  const v = JSON.stringify(math.vector(1,2,3));
  expect(v).toBe('{"0":1,"1":2,"2":3,"length":3}');
});

test("circle", () => {
  const c = JSON.stringify(math.circle(1,2,3));
  expect(c).toBe('"{"origin":{"0":1,"1":2,"length":2},"radius":3}"');
});
