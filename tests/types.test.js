const math = require("../math");

test("types", () => {
  let v = math.vector(1,2,3).normalize();
  expect(typeof v).toBe("object");
  expect(v instanceof math.vector).toBe(true);
  expect(v.constructor === math.vector).toBe(true);
});
