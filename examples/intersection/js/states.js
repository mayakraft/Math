// infinity box
const infinityBox = math.rect(-1, -1, 2, 2).scale(1000);

/**
 * each state is a drawing mode, matching with the toolbar tool (line, circle)
 * each state has keys "svg", "math", the value of each is a function.
 * each function is provided to arguments: (points, lines), each is an array.
 * "svg" is a draw function, returns an svg element
 * "math" is a math object constructor provided the points and lines
 */
const states = {
  // select: {
  //   svg: (points, lines) => SVG.rect(
  //     points[0].x,
  //     points[0].y,
  //     points[points.length - 1].x - points[0].x,
  //     points[points.length - 1].y - points[0].y
  //   ).strokeWidth(0.004).strokeDasharray(0.01),
  //   math: math.rect.fromPoints,
  // },
  // remove: {
  //   svg: SVG.g,
  //   math: (points, lines) => {},
  // },
  line: {
		isLine: true,
    svg: (points, lines) => {
      const p = infinityBox.clipLine(math.line.fromPoints(...points));
      return p === undefined ? undefined : SVG.line(p[0], p[1]);
    },
    math: (points, lines) => math.line.fromPoints(...points),
  },
  ray: {
		isLine: true,
    svg: (points, lines) => {
      const p = infinityBox.clipRay(math.ray.fromPoints(...points));
      return p === undefined ? undefined : SVG.line(p[0], p[1]);
    },
    math: (points, lines) => math.ray.fromPoints(...points),
  },
  segment: {
		isLine: true,
    svg: (points, lines) => SVG.line(...points),
    math: (points, lines) => math.segment(...points),
  },
  circle: {
    svg: (points, lines) => SVG.circle(...points),
    math: (points, lines) => math.circle.fromPoints(...points),
  },
  "perpendicular-bisector": {
		isLine: true,
    svg: (points, lines) => {
      const p = infinityBox.clipLine(math.line.perpendicularBisector(...points));
      return p ? SVG.line(p[0], p[1]) : SVG.g();
    },
    math: (points, lines) => math.line.perpendicularBisector(...points),
  },
  bisect: {
		isLine: true,
    svg: (points, lines) => {
			const bisect = math.core
				.bisect_lines2(
					lines[0].vector, lines[0].origin,
					lines[1].vector, lines[1].origin)
				.filter(a => a !== undefined);
			if (bisect) {
				const seg = infinityBox.clipLine(bisect);
				return SVG.line(seg[0], seg[1]);
			}
			return SVG.g();
		},
    math: (points, lines) => {
			const bisect = math.core
				.bisect_lines2(
					lines[0].vector, lines[0].origin,
					lines[1].vector, lines[1].origin)
				.filter(a => a !== undefined);
			return math.line(bisect);
		},
  },
  "perpendicular-to": {
		isLine: true,
    svg: (points, lines) => {
			const l = math.line(lines[0].vector.rotate90(), points[points.length - 1]);
			const seg = infinityBox.clipLine(l);
			return seg ? SVG.line(seg[0], seg[1]) : SVG.g();
		},
    math: (points, lines) => math.line(lines[0].vector.rotate90(), points[points.length - 1]),
  },
  // polygon: {
  //   svg: SVG.g,
  //   math: (points, lines) => math.polygon(...points),
  // },
  // this will create an entry in the Cache that a previous
  // shape has been mutated.
  // alter: {
  //   svg: SVG.g,
  //   math: pts => {},
  // }
};

// export default states;
