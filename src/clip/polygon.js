
/** clip an infinite line in a polygon, returns a segment or undefined if no intersection */
export const convex_poly_line = function (poly, lineVector, linePoint) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
    .map(el => intersect_line_seg(lineVector, linePoint, el[0], el[1]))
    .filter(el => el != null);
  switch (intersections.length) {
    case 0: return undefined;
    case 1: return [intersections[0], intersections[0]]; // degenerate segment
    case 2: return intersections;
    default:
      // special case: line intersects directly on a poly point (2 segments, same point)
      //  filter to unique points by [x,y] comparison.
      for (let i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }
      return undefined;
  }
};

export const convex_poly_ray_inclusive = function (poly, lineVector, linePoint) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
    .map(el => intersect_ray_seg_include(lineVector, linePoint, el[0], el[1]))
    .filter(el => el != null);
  switch (intersections.length) {
    case 0: return undefined;
    case 1: return [linePoint, intersections[0]];
    case 2:
      return quick_equivalent_2(intersections[0], intersections[1])
        ? [linePoint, intersections[0]]
        : intersections;
    // default: throw "clipping ray in a convex polygon resulting in 3 or more points";
    default:
      for (let i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }
      return undefined;
  }
};

export const convex_poly_ray_exclusive = function (poly, lineVector, linePoint) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
    .map(el => intersect_ray_seg_exclude(lineVector, linePoint, el[0], el[1]))
    .filter(el => el != null);
  switch (intersections.length) {
    case 0: return undefined;
    case 1: return [linePoint, intersections[0]];
    case 2: return intersections;
    // default: throw "clipping ray in a convex polygon resulting in 3 or more points";
    default:
      for (let i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }
      return undefined;
  }
};

export const convex_poly_segment_inclusive = function (poly, segmentA, segmentB, epsilon = EPSILON) {
  console.log("todo")
};

// todo: double check that this is segment method is exclusive
export const convex_poly_segment_exclusive = function (poly, segmentA, segmentB, epsilon = EPSILON) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // polygon into segment pairs
    .map(el => intersect_seg_seg_exclude(segmentA, segmentB, el[0], el[1]))
    .filter(el => el != null);

  const aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly, epsilon);
  const bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly, epsilon);
  const aInsideInclusive = point_in_convex_poly_inclusive(segmentA, poly, epsilon);
  const bInsideInclusive = point_in_convex_poly_inclusive(segmentB, poly, epsilon);

  // both are inside, OR, one is inside and the other is collinear to poly
  if (intersections.length === 0
    && (aInsideExclusive || bInsideExclusive)) {
    return [segmentA, segmentB];
  }
  if (intersections.length === 0
    && (aInsideInclusive && bInsideInclusive)) {
    return [segmentA, segmentB];
  }
  switch (intersections.length) {
    case 0: return (aInsideExclusive
      ? [[...segmentA], [...segmentB]]
      : undefined);
    case 1: return (aInsideInclusive
      ? [[...segmentA], intersections[0]]
      : [[...segmentB], intersections[0]]);
    case 2: return intersections;
    default: throw new Error("clipping segment in a convex polygon resulting in 3 or more points");
  }
};

