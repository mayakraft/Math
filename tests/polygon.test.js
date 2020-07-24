const math = require("../math");

const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));

test("prototype member variables accessing 'this'", () => {
  equalTest(4, math.polygon.regularPolygon(4).edges.length);
  equalTest(4, math.polygon.regularPolygon(4).area());
});

test("polygon", () => {
  // equalTest(
  //   math.polygon.regularPolygon(4).clipLine(math.line(0.5, 0.5, 6, -11)),
  //   math.convexPolygon.regularPolygon(4).clipLine(math.line(0.5, 0.5, 6, -11))
  // );
  const segment = math.polygon.regularPolygon(4).clipLine(math.line(1, 0));
  equalTest(-1, segment[0][0]);
  equalTest(0, segment[0][1]);
  equalTest(1, segment[1][0]);
  equalTest(0, segment[1][1]);

  // equalTest(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).sides);
  // equalTest(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).split);
  // equalTest(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).overlaps);
  // equalTest(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).scale);
  // equalTest(true, math.convexPolygon([1, 0], [0, 1.87], [-1, 0]).rotate);
});

// clipEdge
// clipLine
// clipRay
