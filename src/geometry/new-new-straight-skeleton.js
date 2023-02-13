svg.size(100, 100)
	.background("transparent")
	.strokeWidth(svg.getWidth() / 250);

// polygon vertices will be set later
const polygon = svg.polygon()
	.fill("none")
	.stroke("lightgray")
	.strokeLinecap("round");

const drawLayer = svg.g();

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
	if (graph.memo.vertexRayIntersections[key]) {
		return graph.memo.vertexRayIntersections[key];
	}
	// intersection does not already exist. compute it.
	const rays = [v0, v1].map(v => graph.vertices_ray[v]);
	const intersection = ear.intersect(...rays);
	// store memo. return.
	graph.memo.vertexRayIntersections[key] = intersection;
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

const drawFindBranch = (graph, {
	poly_vert_prevPair,
	poly_vert_prevPairIntersect,
	poly_vert_nextPairIntersect,
	poly_vert_prevIntersectBase,
	poly_vert_prevIntersectValid,
	poly_vert_prevProjection,
	result,
}, count) => {
	const color = `hsl(${count * 60}, 90%, 45%)`;
	poly_vert_prevPairIntersect
		.forEach((inter, v) => (inter === undefined ? {} : drawLayer
			.line(inter, graph.vertices_coords[graph.polygon_vertices[v]])
			.stroke("lightgray")));
	poly_vert_nextPairIntersect
		.forEach((inter, v) => (inter === undefined ? {} : drawLayer
			.line(inter, graph.vertices_coords[graph.polygon_vertices[v]])
			.stroke("lightgray")));
	poly_vert_prevPairIntersect
		.map((point, i) => ({ point, i }))
		.filter(el => poly_vert_prevIntersectValid[el.i])
		.forEach(el => poly_vert_prevPair[el.i]
			.forEach(v => drawLayer
				.line(el.point, graph.vertices_coords[v])
				.stroke("gray")));
	poly_vert_prevPairIntersect
		.filter(a => a !== undefined)
		.forEach(p => drawLayer.circle(p).radius(0.5).fill("lightblue"));
	poly_vert_prevProjection
		.forEach((point, i) => drawLayer
			.line(point, poly_vert_prevPairIntersect[i])
			.stroke("lightblue"));
	poly_vert_prevProjection
		.filter(point => point)
		.forEach(point => drawLayer
			.circle(point)
			.radius(0.5)
			.fill("blue"));
	// result stuff
	drawLayer.circle(result.intersection).radius(0.5).fill("orange");
	result.parents
		.map(v => graph.vertices_coords[v])
		.forEach(coord => drawLayer.line(result.intersection, coord)
			.stroke("orange"));
	drawLayer.arrow(
		result.new_vertices_ray.origin,
		result.new_vertices_ray.origin
			.add(result.new_vertices_ray.scale(7).vector),
	).head({ width: 2, height: 3 })
		.stroke("orange")
		.fill("orange");
};

const drawFinalStep = (graph, center) => {
	drawLayer.circle(center).radius(0.5).fill("red");
	graph.polygon_vertices
		.map(v => graph.vertices_coords[v])
		.forEach(coords => drawLayer.line(center, coords)
			.stroke("red"));
};

const findNextSkeletonBranch = (graph, count = 0) => {
	if (graph.polygon_vertices.length === 3) {
		const center = getBisectorIntersection(graph, ...graph.polygon_vertices);
		drawFinalStep(graph, center);
		return undefined;
	}
	if (graph.polygon_vertices.length < 3) {
		console.log("caught. less than 3");
		return undefined;
	}
	// walk around the polygon. for every vertex, get this vertex
	// and the previous/next vertex in the cycle, as a pair of ints.
	// maintain the order of the pair of vertices (polygon winding)
	const poly_vert_prevPair = graph.polygon_vertices
		.map((v, i, arr) => [arr[(i + arr.length - 1) % arr.length], v]);
	const poly_vert_nextPair = graph.polygon_vertices
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]]);
	// for each vertex's bisector, get the intersection
	// (if it exists) with the previous/next vertex in the cycle
	const poly_vert_prevPairIntersect = poly_vert_prevPair
		.map(verts => getBisectorIntersection(graph, ...verts));
	const poly_vert_nextPairIntersect = poly_vert_nextPair
		.map(verts => getBisectorIntersection(graph, ...verts));
	// for each polygon vertex, get the length from it to the shared
	// intersection with the previous / next vertex
	const poly_vert_prevIntersectLength = poly_vert_prevPairIntersect
		.map((pt, i) => (pt === undefined
			? Infinity
			: ear.math.distance2(pt, graph
				.vertices_coords[graph.polygon_vertices[i]])));
	const poly_vert_nextIntersectLength = poly_vert_nextPairIntersect
		.map((pt, i) => (pt === undefined
			? Infinity
			: ear.math.distance2(pt, graph
				.vertices_coords[graph.polygon_vertices[i]])));
	// using these distances, and given that each vertex
	// intersects with both of its neighbors, only let intersections
	// through if for both vertices involved, this intersection is
	// the shorter of the vertex's two intersections. otherwise,
	// we will make connections which skip over nearer intersections.

	// true = prev is shorter, false = next is shorter
	const poly_vert_bothIntersectLengths = graph.polygon_vertices
		.map((_, i) => [
			poly_vert_prevIntersectLength[i],
			poly_vert_nextIntersectLength[i],
		]);
	const poly_vert_shorterIntersect = poly_vert_bothIntersectLengths
		.map(pair => pair[0] < pair[1]);
	const poly_vert_prevIntersectValid = poly_vert_shorterIntersect
		.map((valid, i, a) => !(a[(i + a.length - 1) % a.length]) && valid);

	// get the side (defined as pair of vertices) which the
	// intersection point should be projected down to.
	// (this is one of three possible base sides).
	// winding is not preserved. order of vertices
	// goes from this [0] to neighbor [1].
	const poly_vert_prevIntersectBase = graph.polygon_vertices
		.map(vert => graph.vertices_bisectorSides_vertices[vert])
		.map(sides => sides[0]);
	// const poly_vert_nextIntersectBase = graph.polygon_vertices
	// 	.map(vert => graph.vertices_bisectorSides_vertices[vert])
	// 	.map(sides => sides[1]);
	// convert each base into a geometric line (origin, vector)
	const poly_vert_prevIntersectBaseLine = poly_vert_prevIntersectBase
		.map(verts => graph.edges_lines[`${verts[0]} ${verts[1]}`]);
	// project each intersection point onto the corresponding
	// base line, result is the scale along the line's vector.
	const poly_vert_prevProjectionT = poly_vert_prevPairIntersect
		.map((pt, i) => (pt === undefined
			? undefined
			: projectPointOnLine(poly_vert_prevIntersectBaseLine[i], pt)));
	// get the actual geometric point that is the projection
	// of the intersection point down to the base line.
	const poly_vert_prevProjection = poly_vert_prevProjectionT
		.map((t, i) => (t === undefined
			? undefined
			: scaledPointOnLine(poly_vert_prevIntersectBaseLine[i], t)));
	// get the length of this projection line
	const poly_vert_prevProjLength = poly_vert_prevProjection
		.map((proj, i) => (proj === undefined
			? Infinity
			: ear.math.distance2(poly_vert_prevPairIntersect[i], proj)));

	// using these projection distances, and given that each vertex
	// intersects with both of its neighbors, only let intersections
	// through if for both vertices involved, this intersection is
	// the shorter of the vertex's two intersections. otherwise,
	// we will make connections which skip over nearer intersections.
	//
	// // true = prev is shorter, false = next is shorter
	// const poly_vert_bothIntersectLengths = poly_vert_prevProjLength
	// 	.map((len, i, arr) => [len, arr[(i + 1) % arr.length]]);
	// const poly_vert_shorterIntersect = poly_vert_bothIntersectLengths
	// 	.map(pair => pair[0] < pair[1]);
	// const poly_vert_prevIntersectValid = poly_vert_shorterIntersect
	// 	.map((valid, i, arr) => !(arr[(i + arr.length - 1) % arr.length]) && valid);

	// const poly_vert_shorterIntersect = poly_vert_prevProjLength
	// 	.map((len, i, arr) => len < arr[(i + 1) % arr.length]);
	// const poly_vert_shorterPair = poly_vert_shorterIntersect
	// 	.map((valid, i, arr) => [!(arr[(i + arr.length - 1) % arr.length]), valid]);
	// const poly_vert_intersectValid = poly_vert_shorterIntersect
	// 	.map((valid, i, arr) => valid && !(arr[(i + arr.length - 1) % arr.length]));
	// find the shortest projection line length
	// this will be the next skeleton intersection
	let shortestValue = Infinity;
	let shortest = -1;
	for (let i = 0; i < poly_vert_prevProjLength.length; i += 1) {
		if (!poly_vert_prevIntersectValid[i]) { continue; }
		if (poly_vert_prevProjLength[i] < shortestValue) {
			shortest = i;
			shortestValue = poly_vert_prevProjLength[shortest];
		}
	}
	// console.log("poly_vert_prevPair", poly_vert_prevPair);
	// console.log("poly_vert_nextPair", poly_vert_nextPair);
	// console.log("poly_vert_prevPairIntersect", poly_vert_prevPairIntersect);
	// console.log("poly_vert_nextPairIntersect", poly_vert_nextPairIntersect);
	// console.log("poly_vert_prevIntersectLength", poly_vert_prevIntersectLength);
	// console.log("poly_vert_nextIntersectLength", poly_vert_nextIntersectLength);
	// console.log("poly_vert_prevIntersectBase", poly_vert_prevIntersectBase);
	// console.log("poly_vert_nextIntersectBase", poly_vert_nextIntersectBase);
	// console.log("poly_vert_prevIntersectBaseLine", poly_vert_prevIntersectBaseLine);
	// console.log("poly_vert_prevProjection", poly_vert_prevProjection);
	// console.log("poly_vert_prevProjLength", poly_vert_prevProjLength);
	// console.log("poly_vert_bothIntersectLengths", poly_vert_bothIntersectLengths);
	// console.log("poly_vert_shorterIntersect", poly_vert_shorterIntersect);
	// console.log("poly_vert_prevIntersectValid", poly_vert_prevIntersectValid);
	// console.log("shortest", shortest);
	if (shortest === -1) {
		return undefined;
	}
	const result = {
		i: shortest,
		intersection: poly_vert_prevPairIntersect[shortest],
		parents: poly_vert_prevPair[shortest],
		new_vertices_bisectorSides_vertices: [ // poly_vert_prevPair[shortest]
			graph.vertices_bisectorSides_vertices[poly_vert_prevPair[shortest][0]][0],
			graph.vertices_bisectorSides_vertices[poly_vert_prevPair[shortest][1]][1],
		],
	};
	result.new_vertices_ray = ear.ray(
		bisectorBetweenSides(graph, result.new_vertices_bisectorSides_vertices),
		result.intersection,
	);

	if (count === 33) {
		drawFindBranch(graph, {
			poly_vert_prevPair,
			poly_vert_prevPairIntersect,
			poly_vert_nextPairIntersect,
			poly_vert_prevIntersectBase,
			poly_vert_prevIntersectValid,
			poly_vert_prevProjection,
			result,
		}, count);
	}
	return result;
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

	while (nextBranch !== undefined && count < 3) {
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
		// drawSkeletonGraph(graph);

		// console.log(points.map(p => p
		// 	.map(n => parseFloat(n.toFixed(2)))));
	}, true);
