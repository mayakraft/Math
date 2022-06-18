const math = require("../math");

const testEqualVectors = function (...args) {
  expect(math.core.equivalent_vectors(...args)).toBe(true);
};

test("nearest point", () => {
  testEqualVectors([5, 5], math.core.nearest_point2([10, 0],
    [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]]));
  testEqualVectors([6, 6, 0], math.core.nearest_point([10, 0, 0],
    [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 1],
      [5, 5, 10], [6, 6, 0], [7, 7, 0], [8, 8, 0], [9, 9, 0]]));
});

test("circumcircle", () => {
  const circle = math.core.circumcircle([1,0], [0,1], [-1,0]);
  expect(circle.origin[0]).toBeCloseTo(0);
  expect(circle.origin[1]).toBeCloseTo(0);
  expect(circle.radius).toBeCloseTo(1);
  // todo, this is the degenerate case. not sure why the result is such
  const circle2 = math.core.circumcircle([1,0], [0,0], [-1,0]);
  expect(circle2.origin[0]).toBeCloseTo(0);
  expect(circle2.origin[1]).toBeCloseTo(0);
  expect(circle2.radius).toBeCloseTo(1);
});

test("signed_area", () => {
  expect(math.core.signed_area([[1,0], [0,1], [-1,0], [0,-1]])).toBeCloseTo(2);
  expect(math.core.signed_area([[1,0], [0,1], [-1,0]])).toBeCloseTo(1);
});

test("centroid", () => {
  expect(math.core.centroid([[1,0], [0,1], [-1,0], [0,-1]])[0]).toBeCloseTo(0);
  expect(math.core.centroid([[1,0], [0,1], [-1,0], [0,-1]])[1]).toBeCloseTo(0);
  expect(math.core.centroid([[1,0], [0,1], [-1,0]])[0]).toBeCloseTo(0);
  expect(math.core.centroid([[1,0], [0,1], [-1,0]])[1]).toBeCloseTo(1/3);

});

test("bounding_box", () => {
  const box = math.core.bounding_box([[1,0], [0,1], [-1,0], [0,-1]]);
  expect(box.min[0]).toBe(-1);
  expect(box.min[1]).toBe(-1);
  expect(box.span[0]).toBe(2);
  expect(box.span[1]).toBe(2);
});

test("make_polygon_circumradius", () => {
	expect(math.core.make_polygon_circumradius().length).toBe(3);
	const vert_square = math.core.make_polygon_circumradius(4);
	expect(vert_square[0][0]).toBe(1);
	expect(vert_square[0][1]).toBe(0);
	const vert_square_2 = math.core.make_polygon_circumradius(4, 2);
	expect(vert_square_2[0][0]).toBe(2);
	expect(vert_square_2[0][1]).toBe(0);

  const tri1 = math.core.make_polygon_circumradius(3);
  const tri2 = math.core.make_polygon_circumradius(3, 2);
  // first coord (1,0)
  expect(tri1[0][0]).toBeCloseTo(1);
  expect(tri1[0][1]).toBeCloseTo(0);
  expect(tri1[1][0]).toBeCloseTo(-0.5);
  expect(tri1[1][1]).toBeCloseTo(Math.sqrt(3)/2);
  expect(tri1[2][0]).toBeCloseTo(-0.5);
  expect(tri1[2][1]).toBeCloseTo(-Math.sqrt(3)/2);
  //2
  expect(tri2[0][0]).toBeCloseTo(2);
  expect(tri2[1][0]).toBeCloseTo(-1);
});

test("make regular polygon side aligned", () => {
	const square = math.core.make_polygon_circumradius_s(4);
	expect(square[0][0]).toBeCloseTo(Math.sqrt(2) / 2);
	const square2 = math.core.make_polygon_circumradius_s(4, 2);
	expect(square2[0][0]).toBeCloseTo(Math.sqrt(2));
});

test("make regular polygon inradius", () => {
	const square = math.core.make_polygon_inradius(4);
	expect(square[0][0]).toBeCloseTo(Math.sqrt(2));
	expect(square[0][1]).toBeCloseTo(0);
});

test("make_polygon_inradius_s", () => {
	const square = math.core.make_polygon_inradius_s(4);
	expect(square[0][0]).toBe(1);
	const square2 = math.core.make_polygon_inradius_s(4, 2);
	expect(square2[0][0]).toBe(2);
});

test("make_polygon_side_length", () => {
	const square = math.core.make_polygon_side_length(4);
	expect(square[0][0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(square[0][1]).toBe(0);
	const square2 = math.core.make_polygon_side_length(4, 2);
	expect(square2[0][0]).toBeCloseTo(Math.sqrt(2));
	expect(square2[0][1]).toBe(0);
});

test("make_polygon_side_length_s", () => {
	const square = math.core.make_polygon_side_length_s(4);
	expect(square[0][0]).toBe(0.5);
	const square2 = math.core.make_polygon_side_length_s(4, 2);
	expect(square2[0][0]).toBe(1);
});


// test("split_polygon", () => {
//   math.core.split_polygon(poly, lineVector, linePoint)
// });

test("split_convex_polygon", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const rect_clock = [
    [-1, -1],
    [-1, +1],
    [+1, +1],
    [+1, -1],
  ];
  const res0 = math.core.split_convex_polygon(rect_counter, [1,2], [0,0]);
  [[-1,1], [-1,-1], [-0.5,-1], [0.5,1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
  });
  [[1,-1], [1,1], [0.5,1], [-0.5,-1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
  });
});

test("split_convex_polygon no overlap", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const result = math.core.split_convex_polygon(rect_counter, [1,2], [10,0]);
  rect_counter.forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(result[0][i]));
  });
});

test("split_convex_polygon vertex collinear", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const res0 = math.core.split_convex_polygon(rect_counter, [1,1], [0,0]);
  [[1,1],[-1,1],[-1,-1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
  });
  [[-1,-1],[1,-1],[1,1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
  });
});

test("split_convex_polygon 1 edge and 1 vertex collinear", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const res0 = math.core.split_convex_polygon(rect_counter, [1,2], [-1, -1]);
  [[-1,1],[-1,-1],[0,1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
  });
  [[1,-1],[1,1],[0,1],[-1,-1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
  });
});

test("convex_hull", () => {
  const rect = [
    [1,0],
    [0,0],
    [1,1],
    [0,1],
  ];
  const rect_collinear = [
    [1,0],
    [0,0],
    [0.5, 0],
    [1,1],
    [0, 0.5],
    [0,1],
  ];
  const res0 = math.core.convex_hull(rect);
  const res1 = math.core.convex_hull(rect_collinear);
  // todo this second parameter has been muted
  const res0b = math.core.convex_hull(rect, true);
  const res1b = math.core.convex_hull(rect_collinear, true);

  expect(res0.length).toBe(4);
  expect(res1.length).toBe(4);
  expect(res0b.length).toBe(4);
  // expect(res1b.length).toBe(6);
});

test("straight skeleton triangle", () => {
	const f1f = Math.sqrt(2) - 1;
	const skeleton = math.core.straight_skeleton([[1,0], [0,1], [-1,0]]);
	expect(skeleton.length).toBe(4);
	["skeleton", "skeleton", "skeleton", "perpendicular"]
		.forEach((key, i) => expect(skeleton[i].type).toBe(key));
	[[1, 0], [0, f1f]].forEach((pt, i) => math.core
		.equivalent_vectors(pt, skeleton[0].points[i]));
	[[0, 1], [0, f1f]].forEach((pt, i) => math.core
		.equivalent_vectors(pt, skeleton[1].points[i]));
	[[-1, 0], [0, f1f]].forEach((pt, i) => math.core
		.equivalent_vectors(pt, skeleton[2].points[i]));
});

test("straight skeleton quad", () => {
	const skeleton = math.core.straight_skeleton([[0,0], [2,0], [2,1], [0,1]]);
	expect(skeleton.length).toBe(7);
	// const points = skeleton.map(el => el.points);
	const keys = ["skeleton", "perpendicular"];
	[0, 0, 1, 0, 0, 0, 1].forEach((n,i) => expect(skeleton[i].type).toBe(keys[n]));
});

