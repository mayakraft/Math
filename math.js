/* Math (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.math = {})));
}(this, (function (exports) { 'use strict';

  const magnitude = function (v) {
    const sum = v
      .map(component => component * component)
      .reduce((prev, curr) => prev + curr, 0);
    return Math.sqrt(sum);
  };
  const normalize = function (v) {
    const m = magnitude(v);
    return v.map(c => c / m);
  };
  const dot = function (a, b) {
    return a
      .map((_, i) => a[i] * b[i])
      .reduce((prev, curr) => prev + curr, 0);
  };
  const average = function (...args) {
    const vectors = args;
    const dimension = (vectors.length > 0) ? vectors[0].length : 0;
    const initial = Array.from(Array(dimension)).map(() => 0);
    return vectors
      .reduce((a, b) => a
        .map((_, i) => a[i] + b[i]), initial)
      .map(c => c / vectors.length);
  };
  const cross2 = (a, b) => [a[0] * b[1], a[1] * b[0]];
  const cross3 = function (a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[0] * b[2] - a[2] * b[0],
      a[0] * b[1] - a[1] * b[0],
    ];
  };
  const distance2 = function (a, b) {
    const p = a[0] - b[0];
    const q = a[1] - b[1];
    return Math.sqrt((p ** 2) + (q ** 2));
  };
  const distance3 = function (a, b) {
    const c = a[0] - b[0];
    const d = a[1] - b[1];
    const e = a[2] - b[2];
    return Math.sqrt((c ** 2) + (d ** 2) + (e ** 2));
  };
  const midpoint2 = (a, b) => a.map((_, i) => (a[i] + b[i]) / 2);
  const multiply_vector2_matrix2 = function (vector, matrix) {
    return [
      vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
      vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5],
    ];
  };
  const multiply_line_matrix2 = function (point, vector, matrix) {
    const new_point = multiply_vector2_matrix2(point, matrix);
    const vec_point = vector.map((_, i) => vector[i] + point[i]);
    const new_vector = multiply_vector2_matrix2(vec_point, matrix)
      .map((vec, i) => vec - new_point[i]);
    return [new_point, new_vector];
  };
  const multiply_matrices2 = function (m1, m2) {
    const a = m1[0] * m2[0] + m1[2] * m2[1];
    const c = m1[0] * m2[2] + m1[2] * m2[3];
    const tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
    const b = m1[1] * m2[0] + m1[3] * m2[1];
    const d = m1[1] * m2[2] + m1[3] * m2[3];
    const ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
    return [a, b, c, d, tx, ty];
  };
  const make_matrix2_reflection = function (vector, origin) {
    const angle = Math.atan2(vector[1], vector[0]);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const cos_Angle = Math.cos(-angle);
    const sin_Angle = Math.sin(-angle);
    const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
    const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
    const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
    const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
    const tx = origin[0] + a * -origin[0] + -origin[1] * c;
    const ty = origin[1] + b * -origin[0] + -origin[1] * d;
    return [a, b, c, d, tx, ty];
  };
  const make_matrix2_rotation = function (angle, origin) {
    const a = Math.cos(angle);
    const b = Math.sin(angle);
    const c = -Math.sin(angle);
    const d = Math.cos(angle);
    const tx = (origin != null) ? origin[0] : 0;
    const ty = (origin != null) ? origin[1] : 0;
    return [a, b, c, d, tx, ty];
  };
  const make_matrix2_inverse = function (m) {
    const det = m[0] * m[3] - m[1] * m[2];
    if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) { return undefined; }
    return [
      m[3] / det,
      -m[1] / det,
      -m[2] / det,
      m[0] / det,
      (m[2] * m[5] - m[3] * m[4]) / det,
      (m[1] * m[4] - m[0] * m[5]) / det,
    ];
  };

  var algebra = /*#__PURE__*/Object.freeze({
    magnitude: magnitude,
    normalize: normalize,
    dot: dot,
    average: average,
    cross2: cross2,
    cross3: cross3,
    distance2: distance2,
    distance3: distance3,
    midpoint2: midpoint2,
    multiply_vector2_matrix2: multiply_vector2_matrix2,
    multiply_line_matrix2: multiply_line_matrix2,
    multiply_matrices2: multiply_matrices2,
    make_matrix2_reflection: make_matrix2_reflection,
    make_matrix2_rotation: make_matrix2_rotation,
    make_matrix2_inverse: make_matrix2_inverse
  });

  const EPSILON = 1e-6;
  function clean_number(num, decimalPlaces = 15) {
    return (num == null
      ? undefined
      : parseFloat(num.toFixed(decimalPlaces)));
  }

  const degenerate = function (v) {
    return Math.abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
  };
  const parallel = function (a, b) {
    return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
  };
  const equivalent_numbers = function (...args) {
    if (args.length === 0) { return false; }
    if (args.length === 1 && args[0] !== undefined) {
      return equivalent_numbers(...args[0]);
    }
    return Array
      .from(Array(args.length - 1))
      .map((_, i) => Math.abs(args[0] - args[i + 1]) < EPSILON)
      .reduce((a, b) => a && b, true);
  };
  const equivalent_vectors = function (...args) {
    if (args.length === 0) { return false; }
    if (args.length === 1 && args[0] !== undefined) {
      return equivalent_vectors(...args[0]);
    }
    const dimension = args[0].length;
    const dim_array = Array.from(Array(dimension));
    return Array
      .from(Array(args.length - 1))
      .map((element, i) => dim_array
        .map((_, di) => Math.abs(args[i][di] - args[i + 1][di]) < EPSILON)
        .reduce((prev, curr) => prev && curr, true))
      .reduce((prev, curr) => prev && curr, true)
    && Array
      .from(Array(args.length - 1))
      .map((_, i) => args[0].length === args[i + 1].length)
      .reduce((a, b) => a && b, true);
  };
  const equivalent = function (...args) {
    if (args.length < 1) { return false; }
    const dimension = args[0].length;
    if (args[0].constructor === Array) {
      const dim_array = Array.from(Array(dimension));
      return Array
        .from(Array(args.length - 1))
        .map((element, i) => dim_array
          .map((_, di) => Math.abs(args[i][di] - args[i + 1][di]) < EPSILON)
          .reduce((prev, curr) => prev && curr, true))
        .reduce((prev, curr) => prev && curr, true)
      && Array
        .from(Array(args.length - 1))
        .map((_, i) => args[0].length === args[i + 1].length)
        .reduce((a, b) => a && b, true);
    }
    if (typeof args[0] === "number") {
      return Array
        .from(Array(args.length - 1))
        .map((_, i) => Math.abs(args[0] - args[i + 1]) < EPSILON)
        .reduce((a, b) => a && b, true);
    }
    if (typeof args[0] === "boolean") {
      return Array
        .from(Array(args.length - 1))
        .map((_, i) => args[0] === args[i + 1])
        .reduce((a, b) => a && b, true);
    }
    return false;
  };
  const point_on_line = function (linePoint, lineVector, point, epsilon = EPSILON) {
    const pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
    const cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
    return Math.abs(cross) < epsilon;
  };
  const point_on_edge = function (edge0, edge1, point, epsilon = EPSILON) {
    const edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
    const edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
    const edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
    const dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
    const dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
    const dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
    return Math.abs(dEdge - dP0 - dP1) < epsilon;
  };
  const point_in_poly = function (point, poly) {
    let isInside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
        && point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1])
        / (poly[j][1] - poly[i][1]) + poly[i][0]) {
        isInside = !isInside;
      }
    }
    return isInside;
  };
  const point_in_convex_poly = function (point, poly, epsilon = EPSILON) {
    if (poly == null || !(poly.length > 0)) { return false; }
    return poly.map((p, i, arr) => {
      const nextP = arr[(i + 1) % arr.length];
      const a = [nextP[0] - p[0], nextP[1] - p[1]];
      const b = [point[0] - p[0], point[1] - p[1]];
      return a[0] * b[1] - a[1] * b[0] > -epsilon;
    }).map((s, i, arr) => s === arr[0])
      .reduce((prev, curr) => prev && curr, true);
  };
  const point_in_convex_poly_exclusive = function (point, poly, epsilon = EPSILON) {
    if (poly == null || !(poly.length > 0)) { return false; }
    return poly.map((p, i, arr) => {
      const nextP = arr[(i + 1) % arr.length];
      const a = [nextP[0] - p[0], nextP[1] - p[1]];
      const b = [point[0] - p[0], point[1] - p[1]];
      return a[0] * b[1] - a[1] * b[0] > epsilon;
    }).map((s, i, arr) => s === arr[0])
      .reduce((prev, curr) => prev && curr, true);
  };
  const convex_polygons_overlap = function (ps1, ps2) {
    const e1 = ps1.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
    const e2 = ps2.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
    for (let i = 0; i < e1.length; i += 1) {
      for (let j = 0; j < e2.length; j += 1) {
        if (edge_edge(e1[i][0], e1[i][1], e2[j][0], e2[j][1]) != undefined) {
          return true;
        }
      }
    }
    if (point_in_poly(ps2[0], ps1)) { return true; }
    if (point_in_poly(ps1[0], ps2)) { return true; }
    return false;
  };
  const convex_polygon_is_enclosed = function (inner, outer) {
    const goesInside = outer
      .map(p => point_in_convex_poly(p, inner))
      .reduce((a, b) => a || b, false);
    if (goesInside) { return false; }
    return undefined;
  };
  const convex_polygons_enclose = function (inner, outer) {
    const outerGoesInside = outer
      .map(p => point_in_convex_poly(p, inner))
      .reduce((a, b) => a || b, false);
    const innerGoesOutside = inner
      .map(p => point_in_convex_poly(p, inner))
      .reduce((a, b) => a && b, true);
    return (!outerGoesInside && innerGoesOutside);
  };

  var query = /*#__PURE__*/Object.freeze({
    degenerate: degenerate,
    parallel: parallel,
    equivalent_numbers: equivalent_numbers,
    equivalent_vectors: equivalent_vectors,
    equivalent: equivalent,
    point_on_line: point_on_line,
    point_on_edge: point_on_edge,
    point_in_poly: point_in_poly,
    point_in_convex_poly: point_in_convex_poly,
    point_in_convex_poly_exclusive: point_in_convex_poly_exclusive,
    convex_polygons_overlap: convex_polygons_overlap,
    convex_polygon_is_enclosed: convex_polygon_is_enclosed,
    convex_polygons_enclose: convex_polygons_enclose
  });

  const line_line_comp = () => true;
  const line_ray_comp = (t0, t1) => t1 >= -EPSILON;
  const line_edge_comp = (t0, t1) => t1 >= -EPSILON && t1 <= 1 + EPSILON;
  const ray_ray_comp = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON;
  const ray_edge_comp = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  const edge_edge_comp = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON
    && t1 <= 1 + EPSILON;
  const line_ray_comp_exclusive = (t0, t1) => t1 > EPSILON;
  const line_edge_comp_exclusive = (t0, t1) => t1 > EPSILON && t1 < 1 - EPSILON;
  const ray_ray_comp_exclusive = (t0, t1) => t0 > EPSILON && t1 > EPSILON;
  const ray_edge_comp_exclusive = (t0, t1) => t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
  const edge_edge_comp_exclusive = (t0, t1) => t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON
    && t1 < 1 - EPSILON;
  const limit_line = dist => dist;
  const limit_ray = dist => (dist < -EPSILON ? 0 : dist);
  const limit_edge = (dist) => {
    if (dist < -EPSILON) { return 0; }
    if (dist > 1 + EPSILON) { return 1; }
    return dist;
  };
  const intersection_function = function (aPt, aVec, bPt, bVec, compFunc, epsilon = EPSILON) {
    function det(a, b) { return a[0] * b[1] - b[0] * a[1]; }
    const denominator0 = det(aVec, bVec);
    if (Math.abs(denominator0) < epsilon) { return undefined; }
    const denominator1 = -denominator0;
    const numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
    const numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
    const t0 = numerator0 / denominator0;
    const t1 = numerator1 / denominator1;
    if (compFunc(t0, t1, epsilon)) {
      return [aPt[0] + aVec[0] * t0, aPt[1] + aVec[1] * t0];
    }
    return undefined;
  };
  const line_line = function (aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
  };
  const line_ray = function (linePt, lineVec, rayPt, rayVec, epsilon) {
    return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
  };
  const line_edge = function (point, vec, edge0, edge1, epsilon) {
    const edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
    return intersection_function(point, vec, edge0, edgeVec, line_edge_comp, epsilon);
  };
  const ray_ray = function (aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
  };
  const ray_edge = function (rayPt, rayVec, edge0, edge1, epsilon) {
    const edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
    return intersection_function(rayPt, rayVec, edge0, edgeVec, ray_edge_comp, epsilon);
  };
  const edge_edge$1 = function (a0, a1, b0, b1, epsilon) {
    const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function(a0, aVec, b0, bVec, edge_edge_comp, epsilon);
  };
  const line_ray_exclusive = function (linePt, lineVec, rayPt, rayVec, epsilon) {
    return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp_exclusive, epsilon);
  };
  const line_edge_exclusive = function (point, vec, edge0, edge1, epsilon) {
    const edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
    return intersection_function(point, vec, edge0, edgeVec, line_edge_comp_exclusive, epsilon);
  };
  const ray_ray_exclusive = function (aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp_exclusive, epsilon);
  };
  const ray_edge_exclusive = function (rayPt, rayVec, edge0, edge1, epsilon) {
    const edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
    return intersection_function(rayPt, rayVec, edge0, edgeVec, ray_edge_comp_exclusive, epsilon);
  };
  const edge_edge_exclusive = function (a0, a1, b0, b1, epsilon) {
    const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function(a0, aVec, b0, bVec, edge_edge_comp_exclusive, epsilon);
  };
  const circle_line = function (center, radius, p0, p1, epsilon = EPSILON) {
    const x1 = p0[0] - center[0];
    const y1 = p0[1] - center[1];
    const x2 = p1[0] - center[0];
    const y2 = p1[1] - center[1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const det = x1 * y2 - x2 * y1;
    const det_sq = det * det;
    const r_sq = radius * radius;
    const dr_sq = Math.abs(dx * dx + dy * dy);
    const delta = r_sq * dr_sq - det_sq;
    if (delta < -epsilon) { return undefined; }
    const suffix = Math.sqrt(r_sq * dr_sq - det_sq);
    function sgn(x) { return (x < -epsilon) ? -1 : 1; }
    const solutionA = [
      center[0] + (det * dy + sgn(dy) * dx * suffix) / dr_sq,
      center[1] + (-det * dx + Math.abs(dy) * suffix) / dr_sq,
    ];
    if (delta > epsilon) {
      const solutionB = [
        center[0] + (det * dy - sgn(dy) * dx * suffix) / dr_sq,
        center[1] + (-det * dx - Math.abs(dy) * suffix) / dr_sq,
      ];
      return [solutionA, solutionB];
    }
    return [solutionA];
  };
  const circle_ray = function (center, radius, p0, p1) {
    throw "circle_ray has not been written yet";
  };
  const circle_edge = function (center, radius, p0, p1) {
    const r_squared = radius ** 2;
    const x1 = p0[0] - center[0];
    const y1 = p0[1] - center[1];
    const x2 = p1[0] - center[0];
    const y2 = p1[1] - center[1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dr_squared = dx * dx + dy * dy;
    const D = x1 * y2 - x2 * y1;
    function sgn(x) { if (x < 0) { return -1; } return 1; }
    const x_1 = (D * dy + sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
    const x_2 = (D * dy - sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
    const y_1 = (-D * dx + Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
    const y_2 = (-D * dx - Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
    const x1_NaN = isNaN(x_1);
    const x2_NaN = isNaN(x_2);
    if (!x1_NaN && !x2_NaN) {
      return [
        [x_1 + center[0], y_1 + center[1]],
        [x_2 + center[0], y_2 + center[1]],
      ];
    }
    if (x1_NaN && x2_NaN) { return undefined; }
    if (!x1_NaN) {
      return [[x_1 + center[0], y_1 + center[1]]];
    }
    if (!x2_NaN) {
      return [[x_2 + center[0], y_2 + center[1]]];
    }
  };
  const quick_equivalent_2 = function (a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  };
  const convex_poly_line = function (poly, linePoint, lineVector) {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => line_edge(linePoint, lineVector, el[0], el[1]))
      .filter(el => el != null);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [intersections[0], intersections[0]];
      case 2: return intersections;
      default:
        for (let i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }
        return undefined;
    }
  };
  const convex_poly_ray = function (poly, linePoint, lineVector) {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => ray_edge(linePoint, lineVector, el[0], el[1]))
      .filter(el => el != null);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [linePoint, intersections[0]];
      case 2: return intersections;
      default:
        for (let i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }
        return undefined;
    }
  };
  const convex_poly_edge = function (poly, edgeA, edgeB) {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => edge_edge_exclusive(edgeA, edgeB, el[0], el[1]))
      .filter(el => el != null);
    const aInsideExclusive = point_in_convex_poly_exclusive(edgeA, poly);
    const bInsideExclusive = point_in_convex_poly_exclusive(edgeB, poly);
    const aInsideInclusive = point_in_convex_poly(edgeA, poly);
    const bInsideInclusive = point_in_convex_poly(edgeB, poly);
    if (intersections.length === 0
      && (aInsideExclusive || bInsideExclusive)) {
      return [edgeA, edgeB];
    }
    if (intersections.length === 0
      && (aInsideInclusive && bInsideInclusive)) {
      return [edgeA, edgeB];
    }
    switch (intersections.length) {
      case 0: return (aInsideExclusive
        ? [[...edgeA], [...edgeB]]
        : undefined);
      case 1: return (aInsideInclusive
        ? [[...edgeA], intersections[0]]
        : [[...edgeB], intersections[0]]);
      case 2: return intersections;
      default: throw "clipping edge in a convex polygon resulting in 3 or more points";
    }
  };

  var intersection = /*#__PURE__*/Object.freeze({
    limit_line: limit_line,
    limit_ray: limit_ray,
    limit_edge: limit_edge,
    intersection_function: intersection_function,
    line_line: line_line,
    line_ray: line_ray,
    line_edge: line_edge,
    ray_ray: ray_ray,
    ray_edge: ray_edge,
    edge_edge: edge_edge$1,
    line_ray_exclusive: line_ray_exclusive,
    line_edge_exclusive: line_edge_exclusive,
    ray_ray_exclusive: ray_ray_exclusive,
    ray_edge_exclusive: ray_edge_exclusive,
    edge_edge_exclusive: edge_edge_exclusive,
    circle_line: circle_line,
    circle_ray: circle_ray,
    circle_edge: circle_edge,
    convex_poly_line: convex_poly_line,
    convex_poly_ray: convex_poly_ray,
    convex_poly_edge: convex_poly_edge
  });

  const make_regular_polygon = function (sides, x = 0, y = 0, radius = 1) {
    const halfwedge = 2 * Math.PI / sides * 0.5;
    const r = radius / Math.cos(halfwedge);
    return Array.from(Array(Math.floor(sides))).map((_, i) => {
      const a = -2 * Math.PI * i / sides + halfwedge;
      const px = clean_number(x + r * Math.sin(a), 14);
      const py = clean_number(y + r * Math.cos(a), 14);
      return [px, py];
    });
  };
  const nearest_point = function (linePoint, lineVec, point, limiterFunc, epsilon = EPSILON) {
    const magSquared = (lineVec[0] ** 2) + (lineVec[1] ** 2);
    const vectorToPoint = [0, 1].map((_, i) => point[i] - linePoint[i]);
    const pTo0 = [0, 1].map((_, i) => point[i] - linePoint[i]);
    const dot$$1 = [0, 1].map((_, i) => lineVec[i] * vectorToPoint[i])
      .reduce((a, b) => a + b, 0);
    const distance = dot$$1 / magSquared;
    const d = limiterFunc(distance, epsilon);
    return [0, 1].map((_, i) => linePoint[i] + lineVec[i] * d);
  };
  const clockwise_angle2_radians = function (a, b) {
    while (a < 0) { a += Math.PI * 2; }
    while (b < 0) { b += Math.PI * 2; }
    const a_b = a - b;
    return (a_b >= 0)
      ? a_b
      : Math.PI * 2 - (b - a);
  };
  const counter_clockwise_angle2_radians = function (a, b) {
    while (a < 0) { a += Math.PI * 2; }
    while (b < 0) { b += Math.PI * 2; }
    const b_a = b - a;
    return (b_a >= 0)
      ? b_a
      : Math.PI * 2 - (a - b);
  };
  const clockwise_angle2 = function (a, b) {
    const dotProduct = b[0] * a[0] + b[1] * a[1];
    const determinant = b[0] * a[1] - b[1] * a[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += Math.PI * 2; }
    return angle;
  };
  const counter_clockwise_angle2 = function (a, b) {
    const dotProduct = a[0] * b[0] + a[1] * b[1];
    const determinant = a[0] * b[1] - a[1] * b[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += Math.PI * 2; }
    return angle;
  };
  const interior_angles2 = function (a, b) {
    const interior1 = clockwise_angle2(a, b);
    const interior2 = Math.PI * 2 - interior1;
    return (interior1 < interior2)
      ? [interior1, interior2]
      : [interior2, interior1];
  };
  const bisect_vectors = function (a, b) {
    const aV = normalize(a);
    const bV = normalize(b);
    const sum = aV.map((_, i) => aV[i] + bV[i]);
    const vecA = normalize(sum);
    const vecB = aV.map((_, i) => -aV[i] + -bV[i]);
    return [vecA, normalize(vecB)];
  };
  const bisect_lines2 = function (pointA, vectorA, pointB, vectorB) {
    const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
    if (Math.abs(denominator) < EPSILON) {
      const solution = [midpoint2(pointA, pointB), [vectorA[0], vectorA[1]]];
      const array = [solution, solution];
      const dot$$1 = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
      delete (dot$$1 > 0 ? array[1] : array[0]);
      return array;
    }
    const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
    const t = numerator / denominator;
    const x = pointA[0] + vectorA[0] * t;
    const y = pointA[1] + vectorA[1] * t;
    const bisects = bisect_vectors(vectorA, vectorB);
    bisects[1] = [bisects[1][1], -bisects[1][0]];
    return bisects.map(el => [[x, y], el]);
  };
  const signed_area = function (points) {
    return 0.5 * points.map((el, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      return el[0] * next[1] - next[0] * el[1];
    }).reduce((a, b) => a + b, 0);
  };
  const centroid = function (points) {
    const sixthArea = 1 / (6 * signed_area(points));
    return points.map((el, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      const mag = el[0] * next[1] - next[0] * el[1];
      return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
    }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
      .map(c => c * sixthArea);
  };
  const enclosing_rectangle = function (points) {
    const l = points[0].length;
    const mins = Array.from(Array(l)).map(() => Infinity);
    const maxs = Array.from(Array(l)).map(() => -Infinity);
    points.forEach(point => point
      .forEach((c, i) => {
        if (c < mins[i]) { mins[i] = c; }
        if (c > maxs[i]) { maxs[i] = c; }
      }));
    const lengths = maxs.map((max, i) => max - mins[i]);
    return [mins, lengths];
  };
  const split_polygon = function (poly, linePoint, lineVector) {
    const vertices_intersections = poly.map((v, i) => {
      const intersection = point_on_line(linePoint, lineVector, v);
      return { type: "v", point: intersection ? v : null, at_index: i };
    }).filter(el => el.point != null);
    const edges_intersections = poly.map((v, i, arr) => {
      const intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i + 1) % arr.length]);
      return { type: "e", point: intersection, at_index: i };
    }).filter(el => el.point != null);
    const sorted = vertices_intersections.concat(edges_intersections).sort((a, b) =>
      (Math.abs(a.point[0] - b.point[0]) < EPSILON
        ? a.point[1] - b.point[1]
        : a.point[0] - b.point[0]));
    console.log(sorted);
    return poly;
  };
  const split_convex_polygon = function (poly, linePoint, lineVector) {
    let vertices_intersections = poly.map((v,i) => {
      let intersection = point_on_line(linePoint, lineVector, v);
      return { point: intersection ? v : null, at_index: i };
    }).filter(el => el.point != null);
    let edges_intersections = poly.map((v,i,arr) => {
      let intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length]);
      return { point: intersection, at_index: i };
    }).filter(el => el.point != null);
    if (edges_intersections.length == 2) {
      let sorted_edges = edges_intersections.slice()
        .sort((a,b) => a.at_index - b.at_index);
      let face_a = poly
        .slice(sorted_edges[1].at_index+1)
        .concat(poly.slice(0, sorted_edges[0].at_index+1));
      face_a.push(sorted_edges[0].point);
      face_a.push(sorted_edges[1].point);
      let face_b = poly
        .slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1);
      face_b.push(sorted_edges[1].point);
      face_b.push(sorted_edges[0].point);
      return [face_a, face_b];
    } else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
      vertices_intersections[0]["type"] = "v";
      edges_intersections[0]["type"] = "e";
      let sorted_geom = vertices_intersections.concat(edges_intersections)
        .sort((a,b) => a.at_index - b.at_index);
      let face_a = poly.slice(sorted_geom[1].at_index+1)
        .concat(poly.slice(0, sorted_geom[0].at_index+1));
      if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
      face_a.push(sorted_geom[1].point);
      let face_b = poly
        .slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
      if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
      face_b.push(sorted_geom[0].point);
      return [face_a, face_b];
    } else if (vertices_intersections.length == 2) {
      let sorted_vertices = vertices_intersections.slice()
        .sort((a,b) => a.at_index - b.at_index);
      let face_a = poly
        .slice(sorted_vertices[1].at_index)
        .concat(poly.slice(0, sorted_vertices[0].at_index+1));
      let face_b = poly
        .slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
      return [face_a, face_b];
    }
    return [poly.slice()];
  };
  const convex_hull = function (points, include_collinear = false, epsilon = EPSILON) {
    let INFINITE_LOOP = 10000;
    let sorted = points.slice().sort((a, b) =>
      (Math.abs(a[1] - b[1]) < epsilon
        ? a[0] - b[0]
        : a[1] - b[1]));
    let hull = [];
    hull.push(sorted[0]);
    let ang = 0;
    let infiniteLoop = 0;
    do {
      infiniteLoop += 1;
      let h = hull.length - 1;
      let angles = sorted
        .filter(el => !(Math.abs(el[0] - hull[h][0]) < epsilon
          && Math.abs(el[1] - hull[h][1]) < epsilon))
        .map((el) => {
          let angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
          while (angle < ang) { angle += Math.PI * 2; }
          return { node: el, angle, distance: undefined };
        })
        .sort((a, b) => ((a.angle < b.angle) ? -1 : (a.angle > b.angle) ? 1 : 0));
      if (angles.length === 0) { return undefined; }
      let rightTurn = angles[0];
      angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
        .map((el) => {
          let distance = Math.sqrt(((hull[h][0] - el.node[0]) ** 2) + ((hull[h][1] - el.node[1]) ** 2));
          el.distance = distance;
          return el;
        })
        .sort((a, b) => ((a.distance < b.distance) ? 1 : (a.distance > b.distance) ? -1 : 0));
      if (hull.filter(el => el === angles[0].node).length > 0) {
        return hull;
      }
      hull.push(angles[0].node);
      ang = Math.atan2( hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
    } while (infiniteLoop < INFINITE_LOOP);
    return undefined;
  };

  var geometry = /*#__PURE__*/Object.freeze({
    make_regular_polygon: make_regular_polygon,
    nearest_point: nearest_point,
    clockwise_angle2_radians: clockwise_angle2_radians,
    counter_clockwise_angle2_radians: counter_clockwise_angle2_radians,
    clockwise_angle2: clockwise_angle2,
    counter_clockwise_angle2: counter_clockwise_angle2,
    interior_angles2: interior_angles2,
    bisect_vectors: bisect_vectors,
    bisect_lines2: bisect_lines2,
    signed_area: signed_area,
    centroid: centroid,
    enclosing_rectangle: enclosing_rectangle,
    split_polygon: split_polygon,
    split_convex_polygon: split_convex_polygon,
    convex_hull: convex_hull
  });

  const get_vector = function (...args) {
    if (args.length === 0) { return undefined; }
    if (args.length === 1 && args[0] !== undefined) {
      return get_vector(...args[0]);
    }
    if (typeof args[0] === "number") { return Array.from(args); }
    if (args[0].vector !== undefined) { return get_vector(args[0].vector); }
    if (!isNaN(args[0].x)) {
      return ["x", "y", "z"].map(c => args[0][c]).filter(a => a != null);
    }
    return get_vector(...args[0]);
  };
  function get_matrix2() {
    let params = Array.from(arguments);
    let numbers = params.filter((param) => !isNaN(param));
    let arrays = params.filter((param) => param.constructor === Array);
    if (params.length == 0) { return [1,0,0,1,0,0]; }
    if (params[0].m != null && params[0].m.constructor == Array) {
      numbers = params[0].m.slice();
    }
    if (numbers.length == 0 && arrays.length >= 1) { numbers = arrays[0]; }
    if (numbers.length >= 6) { return numbers.slice(0,6); }
    else if (numbers.length >= 4) {
      let m = numbers.slice(0,4);
      m[4] = 0;
      m[5] = 0;
      return m;
    }
    return [1,0,0,1,0,0];
  }
  function get_edge() {
    let params = Array.from(arguments).filter(p => p != null);
    let numbers = params.filter((param) => !isNaN(param));
    let arrays = params.filter((param) => param.constructor === Array);
    if (params.length === 0) { return undefined; }
    if (!isNaN(params[0]) && numbers.length >= 4) {
      return [
        [params[0], params[1]],
        [params[2], params[3]]
      ];
    }
    if (arrays.length > 0) {
      if (arrays.length === 2) {
        return [
          [arrays[0][0], arrays[0][1]],
          [arrays[1][0], arrays[1][1]]
        ];
      }
      else if (arrays.length === 4) {
        return [
          [arrays[0], arrays[1]],
          [arrays[2], arrays[3]]
        ];
      }
      else { return get_edge(...arrays[0]); }
    }
    if (params[0].constructor === Object) {
      if(params[0].points.length > 0) {
        return params[0].points;
      }
    }
  }
  function get_line() {
    let params = Array.from(arguments);
    let numbers = params.filter((param) => !isNaN(param));
    let arrays = params.filter((param) => param.constructor === Array);
    if (params.length == 0) { return {vector: [], point: []}; }
    if (!isNaN(params[0]) && numbers.length >= 4) {
      return {
        point: [params[0], params[1]],
        vector: [params[2], params[3]]
      };
    }
    if (arrays.length > 0) {
      if (arrays.length === 1) {
        return get_line(...arrays[0]);
      }
      if (arrays.length === 2) {
        return {
          point: [arrays[0][0], arrays[0][1]],
          vector: [arrays[1][0], arrays[1][1]]
        };
      }
      if (arrays.length === 4) {
        return {
          point: [arrays[0], arrays[1]],
          vector: [arrays[2], arrays[3]]
        };
      }
    }
    if (params[0].constructor === Object) {
      let vector = [], point = [];
      if (params[0].vector != null)         { vector = get_vector(params[0].vector); }
      else if (params[0].direction != null) { vector = get_vector(params[0].direction); }
      if (params[0].point != null)       { point = get_vector(params[0].point); }
      else if (params[0].origin != null) { point = get_vector(params[0].origin); }
      return {point, vector};
    }
    return {point: [], vector: []};
  }
  function get_ray() {
    return get_line(...arguments);
  }
  function get_two_vec2() {
    let params = Array.from(arguments);
    let numbers = params.filter((param) => !isNaN(param));
    let arrays = params.filter((param) => param.constructor === Array);
    if (numbers.length >= 4) {
      return [
        [numbers[0], numbers[1]],
        [numbers[2], numbers[3]]
      ];
    }
    if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
      return arrays;
    }
    if (arrays.length == 1 && !isNaN(arrays[0][0][0])) {
      return arrays[0];
    }
  }
  function get_array_of_vec() {
    let params = Array.from(arguments);
    let arrays = params.filter((param) => param.constructor === Array);
    if (arrays.length == 1 && arrays[0].length > 0 && arrays[0][0].length > 0 && !isNaN(arrays[0][0][0])) {
      return arrays[0];
    }
    if (params[0].constructor === Object) {
      if (params[0].points != null) {
        return params[0].points;
      }
    }
  }
  function get_array_of_vec2() {
    let params = Array.from(arguments);
    let arrays = params.filter((param) => param.constructor === Array);
    if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
      return arrays;
    }
    if (arrays.length == 1 && arrays[0].length >= 1) {
      return arrays[0];
    }
    return params;
  }
  function is_number(n) {
    return n != null && !isNaN(n);
  }

  var input = /*#__PURE__*/Object.freeze({
    get_vector: get_vector,
    get_matrix2: get_matrix2,
    get_edge: get_edge,
    get_line: get_line,
    get_ray: get_ray,
    get_two_vec2: get_two_vec2,
    get_array_of_vec: get_array_of_vec,
    get_array_of_vec2: get_array_of_vec2,
    is_number: is_number
  });

  function Vector() {
    let _v = get_vector(...arguments);
    if (_v === undefined) { return; }
    const normalize$$1 = function() {
      return Vector( normalize(_v) );
    };
    const dot$$1 = function() {
      let vec = get_vector(...arguments);
      return _v.length > vec.length
        ? dot(vec, _v)
        : dot(_v, vec);
    };
    const cross = function() {
      let b = get_vector(...arguments);
      let a = _v.slice();
      if(a[2] == null){ a[2] = 0; }
      if(b[2] == null){ b[2] = 0; }
      return Vector( cross3(a, b) );
    };
    const distanceTo = function() {
      let vec = get_vector(...arguments);
      let length = (_v.length < vec.length) ? _v.length : vec.length;
      let sum = Array.from(Array(length))
        .map((_,i) => Math.pow(_v[i] - vec[i], 2))
        .reduce((prev, curr) => prev + curr, 0);
      return Math.sqrt(sum);
    };
    const transform = function() {
      let m = get_matrix2(...arguments);
      return Vector( multiply_vector2_matrix2(_v, m) );
    };
    const add = function() {
      let vec = get_vector(...arguments);
      return Vector( _v.map((v,i) => v + vec[i]) );
    };
    const subtract = function() {
      let vec = get_vector(...arguments);
      return Vector( _v.map((v,i) => v - vec[i]) );
    };
    const rotateZ = function(angle, origin) {
      var m = make_matrix2_rotation(angle, origin);
      return Vector( multiply_vector2_matrix2(_v, m) );
    };
    const rotateZ90 = function() {
      return Vector(-_v[1], _v[0]);
    };
    const rotateZ180 = function() {
      return Vector(-_v[0], -_v[1]);
    };
    const rotateZ270 = function() {
      return Vector(_v[1], -_v[0]);
    };
    const reflect = function() {
      let reflect = get_line(...arguments);
      let m = make_matrix2_reflection(reflect.vector, reflect.point);
      return Vector( multiply_vector2_matrix2(_v, m) );
    };
    const lerp = function(vector, pct) {
      let vec = get_vector(vector);
      let inv = 1.0 - pct;
      let length = (_v.length < vec.length) ? _v.length : vec.length;
      let components = Array.from(Array(length))
        .map((_,i) => _v[i] * pct + vec[i] * inv);
      return Vector(components);
    };
    const isEquivalent = function() {
      let vec = get_vector(...arguments);
      let sm = (_v.length < vec.length) ? _v : vec;
      let lg = (_v.length < vec.length) ? vec : _v;
      return equivalent(sm, lg);
    };
    const isParallel = function() {
      let vec = get_vector(...arguments);
      let sm = (_v.length < vec.length) ? _v : vec;
      let lg = (_v.length < vec.length) ? vec : _v;
      return parallel(sm, lg);
    };
    const scale = function(mag) {
      return Vector( _v.map(v => v * mag) );
    };
    const midpoint = function() {
      let vec = get_vector(...arguments);
      let sm = (_v.length < vec.length) ? _v.slice() : vec;
      let lg = (_v.length < vec.length) ? vec : _v.slice();
      for (let i = sm.length; i < lg.length; i++) { sm[i] = 0; }
      return Vector(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
    };
    const bisect = function() {
      let vec = get_vector(...arguments);
      return bisect_vectors(_v, vec).map(b => Vector(b));
    };
    Object.defineProperty(_v, "normalize", {value: normalize$$1});
    Object.defineProperty(_v, "dot", {value: dot$$1});
    Object.defineProperty(_v, "cross", {value: cross});
    Object.defineProperty(_v, "distanceTo", {value: distanceTo});
    Object.defineProperty(_v, "transform", {value: transform});
    Object.defineProperty(_v, "add", {value: add});
    Object.defineProperty(_v, "subtract", {value: subtract});
    Object.defineProperty(_v, "rotateZ", {value: rotateZ});
    Object.defineProperty(_v, "rotateZ90", {value: rotateZ90});
    Object.defineProperty(_v, "rotateZ180", {value: rotateZ180});
    Object.defineProperty(_v, "rotateZ270", {value: rotateZ270});
    Object.defineProperty(_v, "reflect", {value: reflect});
    Object.defineProperty(_v, "lerp", {value: lerp});
    Object.defineProperty(_v, "isEquivalent", {value: isEquivalent});
    Object.defineProperty(_v, "isParallel", {value: isParallel});
    Object.defineProperty(_v, "scale", {value: scale});
    Object.defineProperty(_v, "midpoint", {value: midpoint});
    Object.defineProperty(_v, "bisect", {value: bisect});
    Object.defineProperty(_v, "x", {get: function(){ return _v[0]; }});
    Object.defineProperty(_v, "y", {get: function(){ return _v[1]; }});
    Object.defineProperty(_v, "z", {get: function(){ return _v[2]; }});
    Object.defineProperty(_v, "magnitude", {get: function() {
      return magnitude(_v);
    }});
    Object.defineProperty(_v, "copy", {value: function() { return Vector(..._v);}});
    return _v;
  }

  function circle (...args) {
    let _origin;
    let _radius;
    const params = Array.from(args);
    const numbers = params.filter(param => !isNaN(param));
    if (numbers.length === 3) {
      _origin = Vector(numbers.slice(0, 2));
      _radius = numbers[2];
    }
    const intersectionLine = function() {
      const line = get_line(...arguments);
      const p2 = [line.point[0] + line.vector[0], line.point[1] + line.vector[1]];
      const intersection = circle_line(_origin, _radius, line.point, p2);
      return (intersection === undefined
        ? undefined
        : intersection.map(i => Vector(i))
      );
    };
    const intersectionRay = function() {
      let points = get_ray(...arguments);
      let intersection = circle_ray(_origin, _radius, points[0], points[1]);
      return (intersection === undefined
        ? undefined
        : intersection.map(i => Vector(i))
      );
    };
    const intersectionEdge = function() {
      let points = get_two_vec2(...arguments);
      let intersection = circle_edge(_origin, _radius, points[0], points[1]);
      return (intersection === undefined
        ? undefined
        : intersection.map(i => Vector(i))
      );
    };
    return {
      intersectionLine,
      intersectionRay,
      intersectionEdge,
      get origin() { return _origin; },
      get radius() { return _radius; },
      set radius(newRadius) { _radius = newRadius; },
    };
  }

  function Matrix2() {
    let _m = get_matrix2(...arguments);
    const inverse = function() {
      return Matrix2( make_matrix2_inverse(_m) );
    };
    const multiply = function() {
      let m2 = get_matrix2(...arguments);
      return Matrix2( multiply_matrices2(_m, m2) );
    };
    const transform = function() {
      let v = get_vector(...arguments);
      return Vector( multiply_vector2_matrix2(v, _m) );
    };
    return {
      inverse,
      multiply,
      transform,
      get m() { return _m; },
    };
  }
  Matrix2.makeIdentity = function() {
    return Matrix2(1,0,0,1,0,0);
  };
  Matrix2.makeTranslation = function(tx, ty) {
    return Matrix2(1,0,0,1,tx,ty);
  };
  Matrix2.makeRotation = function(angle, origin) {
    return Matrix2( make_matrix2_rotation(angle, origin) );
  };
  Matrix2.makeReflection = function(vector, origin) {
    return Matrix2( make_matrix2_reflection(vector, origin) );
  };

  const Line = function (proto) {
    if (proto == null) {
      proto = {};
    }
    const compare_to_line = function (t0, t1, epsilon = EPSILON) {
      return this.compare_function (t0, epsilon) && true;
    };
    const compare_to_ray = function (t0, t1, epsilon = EPSILON) {
      return this.compare_function (t0, epsilon) && t1 >= -epsilon;
    };
    const compare_to_edge = function (t0, t1, epsilon = EPSILON) {
      return this.compare_function (t0, epsilon) && t1 >= -epsilon && t1 <= 1+epsilon;
    };
    const isParallel = function (line, epsilon) {
      if (line.vector == null) {
        throw "line isParallel(): please ensure object contains a vector";
      }
      const this_is_smaller = (this.vector.length < line.vector.length);
      const sm = this_is_smaller ? this.vector : line.vector;
      const lg = this_is_smaller ? line.vector : this.vector;
      return parallel(sm, lg, epsilon);
    };
    const isDegenerate = epsilon => degenerate(this.vector, epsilon);
    const reflection = () => Matrix2.makeReflection(this.vector, this.point);
    const nearestPoint = function (...args) {
      const point = get_vector(args);
      return Vector(nearest_point(this.point, this.vector, point, this.clip_function));
    };
    const intersect = function (other) {
      return intersection_function(
        this.point, this.vector,
        other.point, other.vector,
        ((t0, t1, epsilon = EPSILON) => this.compare_function(t0, epsilon)
             && other.compare_function(t1, epsilon))
          .bind(this));
    };
    const intersectLine = function (...args) {
      const line = get_line(args);
      return intersection_function(
        this.point, this.vector,
        line.point, line.vector,
        compare_to_line.bind(this));
    };
    const intersectRay = function (...args) {
      let ray = get_ray(args);
      return intersection_function(
        this.point, this.vector,
        ray.point, ray.vector,
        compare_to_ray.bind(this));
    };
    const intersectEdge = function (...args) {
      let edge = get_edge(args);
      let edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
      return intersection_function(
        this.point, this.vector,
        edge[0], edgeVec,
        compare_to_edge.bind(this));
    };
    Object.defineProperty(proto, "isParallel", { value: isParallel });
    Object.defineProperty(proto, "isDegenerate", { value: isDegenerate });
    Object.defineProperty(proto, "nearestPoint", { value: nearestPoint });
    Object.defineProperty(proto, "reflection", { value: reflection });
    Object.defineProperty(proto, "intersect", { value: intersect });
    Object.defineProperty(proto, "intersectLine", { value: intersectLine });
    Object.defineProperty(proto, "intersectRay", { value: intersectRay });
    Object.defineProperty(proto, "intersectEdge", { value: intersectEdge });
    return Object.freeze(proto);
  };

  function Line$1(...args) {
    const { point, vector } = get_line(args);
    const transform = function () {
      const mat = get_matrix2(args);
      const line = multiply_line_matrix2(point, vector, mat);
      return Line$1(line[0], line[1]);
    };
    const line = Object.create(Line());
    const compare_function = function () { return true; };
    Object.defineProperty(line, "compare_function", { value: compare_function });
    Object.defineProperty(line, "clip_function", { value: limit_line });
    Object.defineProperty(line, "point", { get: () => Vector(point) });
    Object.defineProperty(line, "vector", { get: () => Vector(vector) });
    Object.defineProperty(line, "length", { get: () => Infinity });
    Object.defineProperty(line, "transform", { value: transform });
    return line;
  }
  Line$1.fromPoints = function (...args) {
    const points = get_two_vec2(args);
    return Line$1({
      point: points[0],
      vector: normalize([
        points[1][0] - points[0][0],
        points[1][1] - points[0][1],
      ]),
    });
  };
  Line$1.perpendicularBisector = function (...args) {
    const points = get_two_vec2(args);
    const vec = normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    ]);
    return Line$1({
      point: average(points[0], points[1]),
      vector: [vec[1], -vec[0]],
    });
  };
  function Ray() {
    let { point, vector } = get_line(...arguments);
    const transform = function () {
      let mat = get_matrix2(...arguments);
      let new_point = multiply_vector2_matrix2(point, mat);
      let vec_point = vector.map((vec,i) => vec + point[i]);
      let new_vector = multiply_vector2_matrix2(vec_point, mat)
        .map((vec,i) => vec - new_point[i]);
      return Ray(new_point, new_vector);
    };
    const rotate180 = function () {
      return Ray(point[0], point[1], -vector[0], -vector[1]);
    };
    let ray = Object.create(LinePrototype());
    const compare_function = function (t0, ep) { return t0 >= -ep; };
    Object.defineProperty(ray, "compare_function", { value: compare_function });
    Object.defineProperty(ray, "clip_function", { value: limit_ray });
    Object.defineProperty(ray, "point", {get: function (){ return Vector(point); }});
    Object.defineProperty(ray, "vector", {get: function (){ return Vector(vector); }});
    Object.defineProperty(ray, "length", {get: function (){ return Infinity; }});
    Object.defineProperty(ray, "transform", {value: transform});
    Object.defineProperty(ray, "rotate180", {value: rotate180});
    return ray;
  }
  Ray.fromPoints = function () {
    let points = get_two_vec2(...arguments);
    return Ray({
      point: points[0],
      vector: normalize([
        points[1][0] - points[0][0],
        points[1][1] - points[0][1]
      ])
    });
  };
  function Edge() {
    let inputs = get_two_vec2(...arguments);
    let edge = Object.create(LinePrototype(Array()));
    let _endpoints = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
    if (_endpoints === undefined) { return; }
    _endpoints.forEach((p,i) => edge[i] = p);
    const transform = function () {
      let mat = get_matrix2(...arguments);
      let transformed_points = edge
        .map(point => multiply_vector2_matrix2(point, mat));
      return Edge(transformed_points);
    };
    const vector = function () {
      return Vector(
        edge[1][0] - edge[0][0],
        edge[1][1] - edge[0][1],
      );
    };
    const midpoint = function () {
      return Vector(average(_endpoints[0], _endpoints[1]));
    };
    const length = function () {
      return Math.sqrt(((edge[1][0] - edge[0][0]) ** 2)
                     + ((edge[1][1] - edge[0][1]) ** 2));
    };
    const compare_function = function (t0, ep) { return t0 >= -ep && t0 <= 1+ep; };
    Object.defineProperty(edge, "compare_function", { value: compare_function });
    Object.defineProperty(edge, "clip_function", { value: limit_edge });
    Object.defineProperty(edge, "point", {get: function (){ return edge[0]; }});
    Object.defineProperty(edge, "vector", {get: function (){ return vector(); }});
    Object.defineProperty(edge, "midpoint", {value: midpoint});
    Object.defineProperty(edge, "length", {get: function (){ return length(); }});
    Object.defineProperty(edge, "transform", {value: transform});
    return edge;
  }

  function Sector(center, pointA, pointB) {
    let _center = get_vector(center);
    let _points = [pointA, pointB];
    let _vectors = _points.map(p => p.map((_,i) => p[i] - _center[i]));
    let _angle = counter_clockwise_angle2(_vectors[0], _vectors[1]);
    const bisect = function() {
      let angles = _vectors.map(el => Math.atan2(el[1], el[0]));
      let bisected = angles[0] + _angle*0.5;
      return Ray(_center[0], _center[1], Math.cos(bisected), Math.sin(bisected));
    };
    const subsect = function(divisions) {
    };
    const contains = function() {
      let point = get_vector(...arguments);
      var cross0 = (point[1] - _points[0][1]) * (_center[0] - _points[0][0]) -
                   (point[0] - _points[0][0]) * (_center[1] - _points[0][1]);
      var cross1 = (point[1] - _center[1]) * (_points[1][0] - _center[0]) -
                   (point[0] - _center[0]) * (_points[1][1] - _center[1]);
      return cross0 < 0 && cross1 < 0;
    };
    return {
      contains,
      bisect,
      subsect,
      get center() { return _center; },
      get points() { return _points; },
      get vectors() { return _vectors; },
      get angle() { return _angle; },
    };
  }

  function Polygon() {
    let _points = get_array_of_vec(...arguments).map(p => Vector(p));
    if (_points === undefined) {
      return undefined;
    }
    let _sides = _points
      .map((p, i, arr) => [p, arr[(i+1)%arr.length]])
      .map(ps => Edge(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
    const contains = function () {
      let point = get_vector(...arguments);
      return point_in_poly(point, _points);
    };
    const scale = function (magnitude$$1, center = centroid(_points)) {
      let newPoints = _points
        .map(p => [0,1].map((_,i) => p[i] - center[i]))
        .map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude$$1));
      return Polygon(newPoints);
    };
    const rotate = function (angle, centerPoint = centroid(_points)) {
      let newPoints = _points.map(p => {
        let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
        let mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
        let a = Math.atan2(vec[1], vec[0]);
        return [
          centerPoint[0] + Math.cos(a+angle) * mag,
          centerPoint[1] + Math.sin(a+angle) * mag
        ];
      });
      return Polygon(newPoints);
    };
    const translate = function () {
      let vec = get_vector(...arguments);
      let newPoints = _points.map(p => p.map((n,i) => n+vec[i]));
      return Polygon(newPoints);
    };
    const transform = function () {
      let m = get_matrix2(...arguments);
      let newPoints = _points
        .map(p => Vector(multiply_vector2_matrix2(p, m)));
      return Polygon(newPoints);
    };
    const sectors = function () {
      return _points.map((p, i, arr) =>
        [arr[(i+arr.length-1)%arr.length], p, arr[(i+1)%arr.length]]
      ).map(points => Sector(points[1], points[2], points[0]));
    };
    const split = function () {
      let line = get_line(...arguments);
      return split_polygon(_points, line.point, line.vector)
        .map(poly => Polygon(poly));
    };
    const clipEdge = function () {
      let edge = get_edge(...arguments);
      let e = convex_poly_edge(_points, edge[0], edge[1]);
      return e === undefined ? undefined : Edge(e);
    };
    const clipLine = function () {
      let line = get_line(...arguments);
      let e = convex_poly_line(_points, line.point, line.vector);
      return e === undefined ? undefined : Edge(e);
    };
    const clipRay = function () {
      let line = get_line(...arguments);
      let e = convex_poly_ray(_points, line.point, line.vector);
      return e === undefined ? undefined : Edge(e);
    };
    const nearest = function () {
      let point = get_vector(...arguments);
      let points = _sides.map(edge => edge.nearestPoint(point));
      let lowD = Infinity, lowI;
      points.map(p => distance2(point, p))
        .forEach((d,i) => { if(d < lowD){ lowD = d; lowI = i;} });
      return {
        point: points[lowI],
        edge: _sides[lowI],
      }
    };
    return {
      contains,
      scale,
      rotate,
      translate,
      transform,
      split,
      clipEdge,
      clipLine,
      clipRay,
      get points() { return _points; },
      get sides() { return _sides; },
      get edges() { return _sides; },
      get sectors() { return sectors(); },
      get area() { return signed_area(_points); },
      get signedArea() { return signed_area(_points); },
      get centroid() { return centroid(_points); },
      get midpoint() { return average(_points); },
      nearest,
      get enclosingRectangle() {
        return Rectangle(enclosing_rectangle(_points));
      },
    };
  }
  Polygon.regularPolygon = function (sides, x = 0, y = 0, radius = 1) {
    let points = make_regular_polygon(sides, x, y, radius);
    return Polygon(points);
  };
  Polygon.convexHull = function (points, includeCollinear = false) {
    let hull = convex_hull(points, includeCollinear);
    return Polygon(hull);
  };
  function ConvexPolygon() {
    let polygon = Object.create(Polygon(...arguments));
    const clipEdge = function () {
      let edge = get_edge(...arguments);
      let e = convex_poly_edge(polygon.points, edge[0], edge[1]);
      return e === undefined ? undefined : Edge(e);
    };
    const clipLine = function () {
      let line = get_line(...arguments);
      let e = convex_poly_line(polygon.points, line.point, line.vector);
      return e === undefined ? undefined : Edge(e);
    };
    const clipRay = function () {
      let line = get_line(...arguments);
      let e = convex_poly_ray(polygon.points, line.point, line.vector);
      return e === undefined ? undefined : Edge(e);
    };
    const split = function () {
      let line = get_line(...arguments);
      return split_convex_polygon(polygon.points, line.point, line.vector)
        .map(poly => ConvexPolygon(poly));
    };
    const overlaps = function () {
      let points = get_array_of_vec(...arguments);
      return convex_polygons_overlap(polygon.points, points);
    };
    const scale = function (magnitude$$1, center = centroid(polygon.points)) {
      let newPoints = polygon.points
        .map(p => [0,1].map((_,i) => p[i] - center[i]))
        .map(vec => vec.map((_,i) => center[i] + vec[i] * magnitude$$1));
      return ConvexPolygon(newPoints);
    };
    const rotate = function (angle, centerPoint = centroid(polygon.points)) {
      let newPoints = polygon.points.map(p => {
        let vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
        let mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
        let a = Math.atan2(vec[1], vec[0]);
        return [
          centerPoint[0] + Math.cos(a+angle) * mag,
          centerPoint[1] + Math.sin(a+angle) * mag
        ];
      });
      return ConvexPolygon(newPoints);
    };
    Object.defineProperty(polygon, "clipEdge", {value: clipEdge});
    Object.defineProperty(polygon, "clipLine", {value: clipLine});
    Object.defineProperty(polygon, "clipRay", {value: clipRay});
    Object.defineProperty(polygon, "split", {value: split});
    Object.defineProperty(polygon, "overlaps", {value: overlaps});
    Object.defineProperty(polygon, "scale", {value: scale});
    Object.defineProperty(polygon, "rotate", {value: rotate});
    return polygon;
  }
  ConvexPolygon.regularPolygon = function (sides, x = 0, y = 0, radius = 1) {
    let points = make_regular_polygon(sides, x, y, radius);
    return ConvexPolygon(points);
  };
  ConvexPolygon.convexHull = function (points, includeCollinear = false) {
    let hull = convex_hull(points, includeCollinear);
    return ConvexPolygon(hull);
  };
  function Rectangle(){
    let _origin, _width, _height;
    let params = Array.from(arguments);
    let numbers = params.filter((param) => !isNaN(param));
    let arrays = params.filter((param) => param.constructor === Array);
    if (numbers.length === 4) {
      _origin = numbers.slice(0,2);
      _width = numbers[2];
      _height = numbers[3];
    }
    if (arrays.length === 1) { arrays = arrays[0]; }
    if (arrays.length === 2) {
      if (typeof arrays[0][0] === "number") {
        _origin = arrays[0].slice();
        _width = arrays[1][0];
        _height = arrays[1][1];
      }
    }
    let points = [
      [_origin[0], _origin[1]],
      [_origin[0] + _width, _origin[1]],
      [_origin[0] + _width, _origin[1] + _height],
      [_origin[0], _origin[1] + _height],
    ];
    let rect = Object.create(ConvexPolygon(points));
    const scale = function (magnitude$$1, center) {
      if (center == null) {
        center = [_origin[0] + _width, _origin[1] + _height];
      }
      let x = _origin[0] + (center[0] - _origin[0]) * (1-magnitude$$1);
      let y = _origin[1] + (center[1] - _origin[1]) * (1-magnitude$$1);
      return Rectangle(x, y, _width*magnitude$$1, _height*magnitude$$1);
    };
    Object.defineProperty(rect, "origin", {get: function (){ return _origin; }});
    Object.defineProperty(rect, "width", {get: function (){ return _width; }});
    Object.defineProperty(rect, "height", {get: function (){ return _height; }});
    Object.defineProperty(rect, "area", {
      get: function (){ return _width * _height; }
    });
    Object.defineProperty(rect, "scale", {value: scale});
    return rect;
  }

  function Junction(center, points) {
    let _points = get_array_of_vec(points);
    if (_points === undefined) {
      return undefined;
    }
    let _center = get_vector(center);
    let _vectors = _points.map(p => p.map((_, i) => p[i] - center[i]));
    let _angles = _vectors.map(v => Math.atan2(v[1], v[0]));
    let clockwise_order = Array.from(Array(_angles.length))
      .map((_, i) => i)
      .sort((a, b) => _angles[a] - _angles[b]);
    clockwise_order = clockwise_order
      .slice(clockwise_order.indexOf(0), clockwise_order.length)
      .concat(clockwise_order.slice(0, clockwise_order.indexOf(0)));
    const kawasaki = function () {
      let angles = points
        .map(p => [p.position[0] - sketch.width/2, p.position[1] - sketch.height/2])
        .map(v => Math.atan2(v[1], v[0]))
        .sort((a,b) => a - b);
      let r = (sketch.width > sketch.height) ? sketch.height*0.4 : sketch.width*0.4;
      let wedges = angles.map((_, i, arr) =>
        RabbitEar.svg.wedge(sketch.width/2, sketch.height/2, r, angles[i], angles[(i+1)%arr.length])
      );
      let wedgeColors = ["#314f69", "#e35536"];
      wedges.forEach((w, i) => w.setAttribute("fill", wedgeColors[i%2]));
      wedges.forEach(w => sketch.sectorLayer.appendChild(w));
    };
    const sectors = function() {
      return clockwise_order.map((_,i,arr) => Sector(_center, _points[clockwise_order[i]], _points[clockwise_order[(i+1)%clockwise_order.length]]));
    };
    const alternatingAngleSum = function() {
      let interior = sectors().map(s => s.angle);
      return [
        interior.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0),
        interior.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0)
      ];
    };
    const kawasaki_from_even = function(array) {
      let even_sum = array.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0);
      let odd_sum = array.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0);
      return [Math.PI - even_sum, Math.PI - odd_sum];
    };
    const kawasaki_solutions = function() {
      return clockwise_order.map((_,i) => {
        let thisV = _vectors[clockwise_order[i]];
        let nextV = _vectors[clockwise_order[(i+1)%clockwise_order.length]];
        return counter_clockwise_angle2(thisV, nextV);
      }).map((_, i, arr) =>
        arr.slice(i+1,arr.length).concat(arr.slice(0,i))
      ).map(a => kawasaki_from_even(a))
      .map((kawasakis, i, arr) =>
        (kawasakis == null
          ? undefined
          : _angles[clockwise_order[i]] + kawasakis[0])
      ).map(k => (k === undefined)
        ? undefined
        : [Math.cos(k), Math.sin(k)]
      );
    };
    return {
      kawasaki,
      kawasaki_solutions,
      alternatingAngleSum,
      sectors,
      get center() { return _center; },
      get points() { return _points; },
      get vectors() { return _vectors; },
      get angles() { return _angles; },
    };
  }
  Junction.fromVectors = function(center, vectors) {
    let points = get_array_of_vec(vectors)
      .map(v => v.map((n,i) => n + center[i]));
    return Junction(center, points);
  };

  const core = Object.create(null);
  Object.assign(core, algebra, geometry, query, input);
  core.EPSILON = EPSILON;
  core.intersection = intersection;
  core.clean_number = clean_number;
  Object.freeze(core);

  exports.Vector = Vector;
  exports.Circle = circle;
  exports.Polygon = Polygon;
  exports.ConvexPolygon = ConvexPolygon;
  exports.Rectangle = Rectangle;
  exports.Matrix2 = Matrix2;
  exports.Line = Line$1;
  exports.Ray = Ray;
  exports.Edge = Edge;
  exports.Junction = Junction;
  exports.Sector = Sector;
  exports.core = core;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
