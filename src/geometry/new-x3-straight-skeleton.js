svg.size(100, 100)
	.background("transparent")
	.strokeWidth(svg.getWidth() / 250);

// polygon vertices will be set later
const polygon = svg.polygon()
	.fill("none")
	.stroke("lightgray")
	.strokeLinecap("round");

const drawLayer = svg.g();

// get all pairwise combinations of two elements in an array.
// only unique pairs. no duplicates in terms of pair orders.
const allPairsCombinations = (array) => {
	const result = [];
	for (let i = 0; i < array.length - 1; i += 1) {
		for (let j = i + 1; j < array.length; j += 1) {
			result.push([array[i], array[j]]);
		}
	}
	return result;
};

const projectPointOnLine = (line, point) => {
	const magSq = ear.math.magSquared(line.vector);
	const vectorToPoint = ear.math.subtract2(point, line.origin);
	const dotProd = ear.math.dot2(line.vector, vectorToPoint);
	return dotProd / magSq;
};

const scaledPointOnLine = (line, t) => ear.math.add2(
	ear.math.scale(line.vector, t),
	line.origin,
);

const rayPointSide = (ray, point) => Math.sign(ear.math.cross2(
	ray.vector,
	ear.math.subtract2(point, ray.origin),
));

const bisectorBetweenSides = (graph, sidesVerts) => {
	const points = sidesVerts.map(verts => graph.vertices_coords[verts[0]]);
	const vectors = sidesVerts.map(verts => ear.math.subtract2(
		graph.vertices_coords[verts[1]],
		graph.vertices_coords[verts[0]],
	));
	const result = ear.math.bisectLines2(
		vectors[0],
		points[0],
		vectors[1],
		points[1],
	);
	return result[0].vector;
};

const getBisectorIntersection = (graph, v0, v1) => {
	// check memo for result
	const key = `${v0} ${v1}`;
	const invKey = `${v1} ${v0}`;
	if (key in graph.memo.vertexRayIntersections) {
		return graph.memo.vertexRayIntersections[key];
	}
	if (invKey in graph.memo.vertexRayIntersections) {
		return graph.memo.vertexRayIntersections[invKey];
	}
	// intersection does not already exist. compute it.
	const rays = [v0, v1].map(v => graph.vertices_ray[v]);
	const intersection = ear.intersect(...rays);
	// store memo. return.
	graph.memo.vertexRayIntersections[key] = intersection;
	graph.memo.vertexRayIntersections[invKey] = intersection;
	return intersection;
};

const drawSkeletonGraph = (graph) => {
	graph.vertices_coords.forEach((coords, j) => drawLayer
		.text(`${j}`, ...coords)
		.fontSize(4)
		.fontFamily("Avenir Next"));
	graph.vertices_ray
		.filter(a => a !== undefined)
		.map(ray => ray.scale(5))
		.forEach(ray => drawLayer
			.arrow(ray.origin, ray.origin.add(ray.vector))
			.head({ width: 3, height: 2 })
			.stroke("blue")
			.fill("blue"));
};

// { intersection, parents,
// new_vertices_bisectorSides_vertices, new_vertices_ray }
const drawNextBranchData = (graph, nextBranch, color) => {
	drawLayer.arrow(
		nextBranch.new_vertices_ray.origin,
		nextBranch.new_vertices_ray.origin
			.add(nextBranch.new_vertices_ray.scale(7).vector),
	).head({ width: 2, height: 3 })
		.stroke(color)
		.fill(color);
	nextBranch.parents.map(v => graph.vertices_coords[v])
		.forEach(coords => drawLayer.line(coords, nextBranch.intersection)
			.stroke(color));
	nextBranch.new_vertices_bisectorSides_vertices
		.map(verts => verts.map(v => graph.vertices_coords[v]))
		.forEach(coords => drawLayer.line(coords)
			.stroke(color));
};

// const drawFindBranch = (graph, {
// 	poly_vert_prevPair,
// 	poly_vert_prevPairIntersect,
// 	poly_vert_nextPairIntersect,
// 	poly_vert_prevIntersectBase,
// 	poly_vert_prevIntersectValid,
// 	poly_vert_prevProjection,
// 	result,
// }, count) => {
// 	const color = `hsl(${count * 60}, 90%, 45%)`;
// 	poly_vert_prevPairIntersect
// 		.forEach((inter, v) => (inter === undefined ? {} : drawLayer
// 			.line(inter, graph.vertices_coords[graph.polygon_vertices[v]])
// 			.stroke("lightgray")));
// 	poly_vert_nextPairIntersect
// 		.forEach((inter, v) => (inter === undefined ? {} : drawLayer
// 			.line(inter, graph.vertices_coords[graph.polygon_vertices[v]])
// 			.stroke("lightgray")));
// 	poly_vert_prevPairIntersect
// 		.map((point, i) => ({ point, i }))
// 		.filter(el => poly_vert_prevIntersectValid[el.i])
// 		.forEach(el => poly_vert_prevPair[el.i]
// 			.forEach(v => drawLayer
// 				.line(el.point, graph.vertices_coords[v])
// 				.stroke("gray")));
// 	poly_vert_prevPairIntersect
// 		.filter(a => a !== undefined)
// 		.forEach(p => drawLayer.circle(p).radius(0.5).fill("lightblue"));
// 	poly_vert_prevProjection
// 		.forEach((point, i) => drawLayer
// 			.line(point, poly_vert_prevPairIntersect[i])
// 			.stroke("lightblue"));
// 	poly_vert_prevProjection
// 		.filter(point => point)
// 		.forEach(point => drawLayer
// 			.circle(point)
// 			.radius(0.5)
// 			.fill("blue"));
// 	// result stuff
// 	drawLayer.circle(result.intersection).radius(0.5).fill("orange");
// 	result.parents
// 		.map(v => graph.vertices_coords[v])
// 		.forEach(coord => drawLayer.line(result.intersection, coord)
// 			.stroke("orange"));
// 	drawLayer.arrow(
// 		result.new_vertices_ray.origin,
// 		result.new_vertices_ray.origin
// 			.add(result.new_vertices_ray.scale(7).vector),
// 	).head({ width: 2, height: 3 })
// 		.stroke("orange")
// 		.fill("orange");
// };

const drawFinalStep = (graph, center) => {
	drawLayer.circle(center).radius(0.5).fill("red");
	graph.polygon_vertices
		.map(v => graph.vertices_coords[v])
		.forEach(coords => drawLayer.line(center, coords)
			.stroke("red"));
};

const findNextSkeletonBranch = (graph, count = 0) => {
	// if (graph.polygon_vertices.length === 3) {
	// 	const center = getBisectorIntersection(graph, ...graph.polygon_vertices);
	// 	drawFinalStep(graph, center);
	// 	return undefined;
	// }
	if (graph.polygon_vertices.length < 2) {
		console.log("caught. fewer than 2 vertices");
		return undefined;
	}
	// get every pairwise combination of vertices in the polygon. because
	// of the circular array, we can't really enforce any pairwise ordering.
	const vertices_pairs = allPairsCombinations(graph.polygon_vertices);
	const intersections = vertices_pairs
		.map((verts, i) => ({ i, point: getBisectorIntersection(graph, ...verts) }))
		.filter(el => el.point);
	if (intersections.length === 0) {
		console.log("END", graph.polygon_vertices);
		return undefined;
	}
	const intersections_point = intersections.map(el => el.point);
	const intersections_vertices = intersections.map(el => vertices_pairs[el.i]);
	const intersections_vertices_bisectorSides_vertices = intersections_vertices
		.map(vertices => vertices
			.map(v => graph.vertices_bisectorSides_vertices[v]));

	const intersections_sides_lines = intersections_vertices_bisectorSides_vertices
		.map(el => el
			.map(raySides => raySides
				.map(side => `${side[0]} ${side[1]}`)
				.map(key => graph.edges_lines[key])));

	const intersections_sides_projections_t = intersections_sides_lines
		.map((intersectSides, i) => intersectSides
			.map(lines => projectPointOnLine(lines[0], intersections_point[i])));
	const intersections_sides_projections = intersections_sides_projections_t
		.map((scalars, i) => scalars
			.map((t, j) => scaledPointOnLine(intersections_sides_lines[i][j][0], t)));

	const intersections_sides_projLengths = intersections_sides_projections
		.map((points, i) => points
			.map(point => ear.math.distance2(point, intersections_point[i])));

	// const intersections_sides_lenSum = intersections_sides_projLengths
	// 	.map(lengths => lengths
	// 		.reduce((a, b) => a + b, 0));
	// const intersections_sides_lenAvg = intersections_sides_projLengths
	// 	.map((lengths, _, arr) => lengths
	// 		.reduce((a, b) => a + b, 0) / arr.length);
	const intersections_sides_lenMax = intersections_sides_projLengths
		.map(lengths => Math.max(...lengths));

	let index = 0;
	intersections_sides_lenMax.forEach((value, i) => {
		if (value < intersections_sides_lenMax[index]) {
			index = i;
		}
	});

	// console.log(`${count} find skeleton branch`);
	// console.log("vertices_pairs", vertices_pairs);
	// console.log("intersections_point", intersections_point);
	// console.log("intersections_vertices", intersections_vertices);
	// console.log("intersections_vertices_bisectorSides_vertices", intersections_vertices_bisectorSides_vertices);
	// console.log("intersections_sides_lines", intersections_sides_lines);
	// console.log("intersections_sides_projections_t", intersections_sides_projections_t);
	// console.log("intersections_sides_projections", intersections_sides_projections);
	// console.log("intersections_sides_projLengths", intersections_sides_projLengths);
	// // console.log("intersections_sides_lenSum", intersections_sides_lenSum);
	// // console.log("intersections_sides_lenAvg", intersections_sides_lenAvg);
	// console.log("intersections_sides_lenMax", intersections_sides_lenMax);

	// this is perhaps the most interesting part of the algorithm.
	const intersection = intersections_point[index];
	const parents = intersections_vertices[index];
	const parents_coords = parents.map(v => graph.vertices_coords[v]);
	const otherParentSide = [
		rayPointSide(graph.vertices_ray[parents[0]], parents_coords[1]),
		rayPointSide(graph.vertices_ray[parents[1]], parents_coords[0]),
	];
	const new_vertices_bisectorSides_vertices = otherParentSide
		.map(side => (side < 0 ? 0 : 1))
		.map((side, i) => intersections_vertices_bisectorSides_vertices[index][i][side]);
	const new_vertices_ray = ear.ray(
		bisectorBetweenSides(graph, new_vertices_bisectorSides_vertices),
		intersection,
	);

	// console.log("index", index);
	// console.log("intersection", intersection);
	// console.log("parents", parents);
	// console.log("otherParentSide", otherParentSide);
	// console.log("new_vertices_bisectorSides_vertices", new_vertices_bisectorSides_vertices);
	// console.log("new_vertices_ray", new_vertices_ray);

	return {
		index,
		intersection,
		parents,
		new_vertices_bisectorSides_vertices,
		new_vertices_ray,
	};
};

// this is counting on value2 being "after" value1.
// which still includes the case that value1
// is at the end, and value2 is spot 0 or 1...
const valuesBetweenCircularArray = (arr, value1, value2) => {
	let index1 = arr.indexOf(value1);
	const index2 = arr.indexOf(value2);
	// wrap around
	const values = [];
	if (index2 < index1) {
		index1 += 1;
		while (index1 < arr.length) { values.push(arr[index1]); }
		index1 = 0;
		while (index1 < index2) { values.push(arr[index1]); }
	} else {
		index1 += 1;
		while (index1 < index2) { values.push(arr[index1]); }
	}
	return values;
};

const buildSkeletonGraph = (startPolygon) => {
	const graph = {
		vertices_coords: [...startPolygon],
	};
	graph.polygon_vertices = graph.vertices_coords
		.map((_, i) => i);
	// graph.outsidePolygon_vertices = graph.vertices_coords
	// 	.map((_, i) => i);
	graph.vertices_bisectorSides_vertices = graph.polygon_vertices
		.map((v, i, a) => [
			[v, a[(i + a.length - 1) % a.length]],
			[v, a[(i + 1) % a.length]],
		]);
	// make the bisector for every vertex, the bisector between
	// the pair of neighboring vertices_bisectorSides_vertices.
	// todo: do pre-calculated ones need to be modified as
	// the skeleton changes? i don't think so...
	graph.vertices_ray = graph.vertices_bisectorSides_vertices
		.map(pairs => pairs
			.map(verts => verts
				.map(v => graph.vertices_coords[v])))
		.map(sides => sides
			.map(verts => ear.math.subtract2(verts[1], verts[0]))
			.map(vec => ear.math.normalize2(vec)))
		.map(vecs => ear.math.clockwiseBisect2(vecs[0], vecs[1]))
		.map((vec, i) => ear.ray(vec, graph.vertices_coords[i]));
	// make geometric line representations of all original edges
	graph.edges_lines = {};
	graph.polygon_vertices
		.map((v, i, a) => [v, a[(i + 1) % a.length]])
		.forEach(pair => {
			const keys = [`${pair[0]} ${pair[1]}`, `${pair[1]} ${pair[0]}`];
			const verts = pair.map(v => graph.vertices_coords[v]);
			const vector = ear.math.subtract2(...verts);
			const origin = verts[1];
			const line = { vector, origin };
			keys.forEach(key => { graph.edges_lines[key] = line; });
		});
	// the intersection between pairs of vertices (their vertices_ray)
	// keys: "2 9" (vertices indices), value: geometric 2D point.
	graph.memo = {
		vertexRayIntersections: {},
	};
	return graph;
};

const straightSkeleton = (points) => {
	let count = 0;
	const graph = buildSkeletonGraph(points);
	// console.log("graph", graph);
	// { intersection, parents,
	// new_vertices_bisectorSides_vertices, new_vertices_ray }
	let nextBranch = findNextSkeletonBranch(graph);
	// const edges_vertices = [];
	// const edges_assignment = [];
	// console.log(`${count} nextBranch`, nextBranch);

	while (nextBranch !== undefined && count < 4) {
		const color = `hsl(${count * 60}, 90%, 45%)`;
		drawNextBranchData(graph, nextBranch, color);
		const newVertex = graph.vertices_coords.length;
		graph.vertices_coords.push(nextBranch.intersection);
		graph.vertices_ray.push(nextBranch.new_vertices_ray);
		graph.vertices_bisectorSides_vertices
			.push(nextBranch.new_vertices_bisectorSides_vertices);
		// graph.polygon_vertices = graph.polygon_vertices
		// 	.filter(v => v !== nextBranch.parents[0]
		//     && v !== nextBranch.parents[1]);
		graph.polygon_vertices
			.splice(graph.polygon_vertices
				.indexOf(nextBranch.parents[0]), 0, newVertex);
		graph.polygon_vertices
			.splice(graph.polygon_vertices
				.indexOf(nextBranch.parents[0]), 1);
		graph.polygon_vertices
			.splice(graph.polygon_vertices
				.indexOf(nextBranch.parents[1]), 1);

		count += 1;
		nextBranch = findNextSkeletonBranch(graph, count);
	}

	// const skeleton = {
	// 	vertices_coords: graph.vertices_coords,
	// 	edges_vertices,
	// 	edges_assignment,
	// };
	return graph;

	// drawLayer.origami(skeleton);
};

const example1 = [
	[47, 45], // [68, 38],
	[90, 20],
	[90, 61],
	[55, 69],
	[55, 86],
	[17, 59],
	[30, 6],
];

svg.controls(7)
	.position((_, i) => example1[i])
// 	.position(() => [svg.getWidth(), svg.getHeight()]
// 		.map(n => n * Math.random()))
	.svg(() => svg.circle(0.5).fill("lightgray"))
	.onChange((p, i, points) => {
		drawLayer.removeChildren();
		polygon.setPoints(points);
		const graph = straightSkeleton(points);
		drawSkeletonGraph(graph);

		// console.log(points.map(p => p
		// 	.map(n => parseFloat(n.toFixed(2)))));
	}, true);
