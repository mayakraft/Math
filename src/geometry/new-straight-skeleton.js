svg.size(100, 100)
	.background("transparent")
	.strokeWidth(svg.getWidth() / 100);

// polygon vertices will be set later
const polygon = svg.polygon()
	.fill("none")
	.stroke("lightgray")
	.strokeLinecap("round");

const drawLayer = svg.g();

const projectPointOnLine = (vector, origin, point) => {
	const magSq = ear.math.magSquared(vector);
	const vectorToPoint = ear.math.subtract2(point, origin);
	const dotProd = ear.math.dot2(vector, vectorToPoint);
	return dotProd / magSq;
};

const buildSkeletonGraph = (startPolygon) => {
	const graph = {
		vertices_coords: [...startPolygon],
	};
	graph.polygon_vertices = graph.vertices_coords.map((_, i) => i);
	const vertices_sides_vertices = graph.vertices_coords.map((v, i, a) => [
		[v, a[(i + a.length - 1) % a.length]],
		[v, a[(i + 1) % a.length]],
	]);
	graph.vertices_ray = vertices_sides_vertices
		.map(sides => sides
			.map(verts => ear.math.subtract2(verts[1], verts[0]))
			.map(vec => ear.math.normalize2(vec)))
		.map(vecs => ear.math.clockwiseBisect2(vecs[0], vecs[1]))
		.map((vec, i) => ear.ray(vec, graph.vertices_coords[i]));
	return graph;
};

const findNextSkeletonBranch = (graph) => {
	if (graph.polygon_vertices.length < 3) { return undefined; }
// 	if (graph.polygon_vertices.length === 3) {
// 	  drawLayer.line(
// 	    graph.vertices_coords[graph.polygon_vertices[0]],
// 	    graph.vertices_coords[graph.polygon_vertices[1]],
// 	  ).stroke("black");
// 	  drawLayer.line(
// 	    graph.vertices_coords[graph.polygon_vertices[1]],
// 	    graph.vertices_coords[graph.polygon_vertices[2]],
// 	  ).stroke("black");
// 	  drawLayer.line(
// 	    graph.vertices_coords[graph.polygon_vertices[0]],
// 	    graph.vertices_coords[graph.polygon_vertices[2]],
// 	  ).stroke("black");
// 	  return undefined;
// 	}
	// figure out which of these intersections intersect with
	// their neighbors and determine a start for the skeleton
	const polygon_vertices_ray_intersect_prev = graph.polygon_vertices
		.map((v, i, arr) => [arr[(i + arr.length - 1) % arr.length], v])
		.map(verts => verts.map(v => graph.vertices_ray[v]))
		.map(rays => rays[0] === undefined || rays[1] === undefined
			? undefined
			: ear.intersect(...rays));
	const polygon_vertices_ray_intersect_next = graph.polygon_vertices
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(verts => verts.map(v => graph.vertices_ray[v]))
		.map(rays => rays[0] === undefined || rays[1] === undefined
			? undefined
			: ear.intersect(...rays));
	const polygon_vertices_ray_intersect_prev_dist = polygon_vertices_ray_intersect_prev
		.map((intersect, i) => (intersect === undefined
			? Infinity
			: ear.math.distance2(intersect, graph.vertices_coords[graph.polygon_vertices[i]])));
	const polygon_vertices_ray_intersect_next_dist = polygon_vertices_ray_intersect_next
		.map((intersect, i) => (intersect === undefined
			? Infinity
			: ear.math.distance2(intersect, graph.vertices_coords[graph.polygon_vertices[i]])));
	// which is the shortest distance. false is prev, true is next
	const polygon_vertices_ray_intersect_next_or_prev = polygon_vertices_ray_intersect_prev_dist
		.map((prev_dist, i) => prev_dist > polygon_vertices_ray_intersect_next_dist[i]);
	// these are the contenders for the next skeleton branch
	const intersections_polygon_verts = polygon_vertices_ray_intersect_next_or_prev
		.map((norp, i, arr) => (norp && !(arr[(i + 1) % arr.length]) ? i : undefined))
		.filter(a => a !== undefined)
		.map(p => [p, (p + 1) % graph.polygon_vertices.length]);
	const intersections_point = intersections_polygon_verts
		.map(poly_verts => polygon_vertices_ray_intersect_next[poly_verts[0]]);
	const intersections_poly_sides = intersections_polygon_verts
		.map(poly_verts => [
			[...poly_verts], // base side
			[poly_verts[0], (poly_verts[0] + graph.polygon_vertices.length - 1)
				% graph.polygon_vertices.length], // prev side
			[poly_verts[1], (poly_verts[1] + 1) % graph.polygon_vertices.length], // next side
		]);
	const intersections_poly_sides_projections_t = intersections_poly_sides
		.map((sides, i) => sides
			.map(pair => pair.map(v => graph.vertices_coords[graph.polygon_vertices[v]]))
			.map(verts => projectPointOnLine(
				ear.math.subtract2(verts[1], verts[0]),
				verts[0],
				intersections_point[i],
			)));
	const intersections_poly_sides_projections_valid = intersections_poly_sides_projections_t
		.map(sides => sides
			.map(t => t >= 0 && t <= 1));
	const intersections_poly_sides_projections = intersections_poly_sides_projections_t
		.map((sides, i) => sides
			.map((t, j) => ear.math.add2(
				graph.vertices_coords[graph.polygon_vertices[intersections_poly_sides[i][j][0]]],
				ear.math.scale2(ear.math.subtract2(
					graph.vertices_coords[graph.polygon_vertices[intersections_poly_sides[i][j][1]]],
					graph.vertices_coords[graph.polygon_vertices[intersections_poly_sides[i][j][0]]],
				), t),
			)));
	const intersections_poly_sides_projection_dist = intersections_poly_sides_projections
		.map((points, i) => ear.math.distance2(intersections_point[i], points[0]));
	const index = intersections_poly_sides_projection_dist
		.map((d, i) => ({ d, i }))
		.sort((a, b) => a.d - b.d)
		.map(el => el.i)
		.shift();
	if (index === undefined) { return undefined; }

	// draw stuff
	polygon_vertices_ray_intersect_prev
		.forEach((inter, v) => (inter === undefined
			? {}
			: drawLayer.line(inter, graph.vertices_coords[v])
				.stroke("gray")));
	graph.vertices_ray
		.filter(a => a !== undefined)
		.map(ray => ray.scale(10))
		.forEach(ray => drawLayer
			.arrow(ray.origin, ray.origin.add(ray.vector))
			.head({ width: 4, height: 5 })
			.stroke("blue")
			.fill("blue"));
	intersections_point
		.forEach(p => drawLayer.circle(p).radius(2).fill("lightblue"));
	intersections_polygon_verts
		.map(verts => verts.map(v => graph.vertices_coords[graph.polygon_vertices[v]]))
		.forEach((seg, i) => seg
			.forEach(point => drawLayer.line(point, intersections_point[i])
				.stroke("purple")
				.strokeDasharray("1 1")));
	intersections_poly_sides_projections
		.forEach((sides, i) => sides
			.forEach((point, j) => drawLayer
				.circle(point)
				.radius(2)
				.fill(intersections_poly_sides_projections_valid[i][j]
					? "orange"
					: "lightgray")));

	// prepare data to be returned
	const bisector_edges_vertices = [
		intersections_poly_sides[index][1],
		intersections_poly_sides[index][2],
	].map(edge => edge.map(v => graph.polygon_vertices[v]));

	const vertex_edges_vecs = bisector_edges_vertices
		.map(verts => verts.map(v => graph.vertices_coords[v]))
		.map(verts => ear.math.subtract2(verts[1], verts[0]))
		.map(vec => ear.math.normalize2(vec));
	const ray = ear.ray(
		ear.math.bisectLines2(
			vertex_edges_vecs[0],
			graph.vertices_coords[bisector_edges_vertices[0][0]],
			vertex_edges_vecs[1],
			graph.vertices_coords[bisector_edges_vertices[1][0]],
		)[0].vector,
		intersections_point[index],
	);
	return {
		ray,
		parent_poly_vertices: intersections_poly_sides[index][0], // these will be removed
		parent_vertices: intersections_poly_sides[index][0]
			.map(v => graph.polygon_vertices[v]), // these will be removed
		bisector_edges_vertices, // vertex_edges_vertices
		projections_point: intersections_poly_sides_projections[index],
		projections_valid: intersections_poly_sides_projections_valid[index],
	};
};

// we already know that value2 should be "after" value1.
// which can still mean it wrapped around so technically its before.
const valuesBetweenCircularArray = (arr, value1, value2) => {
	let index1 = arr.indexOf(value1);
	let index2 = arr.indexOf(value2);
	// console.log("inside", index1, index2);
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

let count;
const straightSkeleton = (points) => {
	count = 0;
	const graph = buildSkeletonGraph(points);
	let nextBranch = findNextSkeletonBranch(graph);
	const edges_vertices = [];
	const edges_assignment = [];

	// while (nextBranch !== undefined) {
	while (nextBranch !== undefined && count < 3) {
		const color = `hsl(${count * 60}, 90%, 45%)`;

		drawLayer.circle(nextBranch.ray.origin)
			.radius(2)
			.fill(color);
		nextBranch.parent_vertices
			.map(v => graph.vertices_coords[v])
			.forEach(vert => drawLayer.line(nextBranch.ray.origin, vert).stroke(color));
		nextBranch.bisector_edges_vertices
			.map(edge => edge
				.map(v => graph.vertices_coords[v]))
			.map(s => [s[0][0], s[0][1], s[1][0], s[1][1]])
			.forEach(segment => drawLayer.line(...segment)
				.stroke(color)
				.strokeDasharray(`1 ${(Math.random() + 1).toFixed(2)}`));
				
		const between = valuesBetweenCircularArray(graph.polygon_vertices, ...nextBranch.parent_vertices);
		// console.log("between", between);

		// console.log(`--- round ${count}`);
		// const inter = intersections_smallest_dist;
		// const removeVertices = nextBranch.parent_vertices;
		// const removeVertices = nextBranch.parent_vertices.map(v => graph.polygon_vertices[v]);
		// increment vertices length. new vertex is at the end
		graph.vertices_coords.push(nextBranch.ray.origin);
		graph.vertices_ray.push(nextBranch.ray);
		const vertex = graph.vertices_coords.length - 1;

		graph.polygon_vertices.splice(graph.polygon_vertices.indexOf(between[1]), 0, vertex);

		between.forEach(v => graph.polygon_vertices.splice(graph.polygon_vertices.indexOf(v), 1));

		nextBranch.parent_vertices.forEach(v => { graph.vertices_ray[v] = undefined; });

		// // update the final skeleton data
		// edges_vertices.push([vertex, removeVertices[0]]);
		// edges_vertices.push([vertex, removeVertices[1]]);
		// edges_assignment.push("M");
		// edges_assignment.push("M");
		// nextBranch.projections_point
		// 	.filter((_, i) => nextBranch.projections_valid[i])
		// 	.forEach(point => {
		// 		edges_vertices.push([vertex, graph.vertices_coords.length]);
		// 		edges_assignment.push("V");
		// 		graph.vertices_coords.push(point);
		// 		graph.vertices_ray.push(undefined);
		// 	});

		// modify polygon, remove 2 vertices. add 1.
		// todo: do this without indexOf (can be circular)
		// const parent_poly_index = graph.polygon_vertices.indexOf(removeVertices[0]);
		// console.log("graph.polygon_vertices", graph.polygon_vertices);
		// console.log("removeVertices", removeVertices);
		// console.log("parent_poly_index", parent_poly_index);
		// graph.polygon_vertices.splice(parent_poly_index, 0, vertex);
		// graph.polygon_vertices = graph.polygon_vertices
			// .filter(v => v !== removeVertices[0] && v !== removeVertices[1]);
		// graph.polygon_vertices.splice(graph.polygon_vertices.indexOf(removeVertices[0]), 1);
		// graph.polygon_vertices.splice(graph.polygon_vertices.indexOf(removeVertices[1]), 1, vertex);

		// drawLayer.arrow(
		// 	nextBranch.ray.origin,
		// 	nextBranch.ray.origin.add(nextBranch.ray.scale(10).vector),
		// ).head({ width: 4, height: 5 }).stroke("black").fill("black");

		count += 1;

		// drawLayer.polygon(graph.polygon_vertices.map(v => graph.vertices_coords[v]))
		// 	.fill("none")
		// 	.stroke(`hsl(${count * 60}, 100%, 50%)`);

		// graph.polygon_vertices.forEach((v, i) => drawLayer
		// 	.text(`${i}`, ...graph.vertices_coords[v])
		// 	.fontSize(7)
		// 	.fill("red")
		// 	.fontFamily("Avenir Next"));

		nextBranch = findNextSkeletonBranch(graph);
		// const poly_vert_index = graph.polygon_vertices.indexOf(vertex);

		// HERE. might need to convert polygon_vertices before passing into vertices_ray
		// const vertex_ray_intersect_prev = ear.intersect(
		// 	graph.vertices_ray[(poly_vert_index + graph.polygon_vertices.length - 1)
		// 		% graph.polygon_vertices.length],
		// 	vertex_ray,
		// );
		// const vertex_ray_intersect_next = ear.intersect(
		// 	vertex_ray,
		// 	graph.vertices_ray[(poly_vert_index + 1) % graph.polygon_vertices.length],
		// );
		// const vertices_ray_intersect_prev_dist = vertex_ray_intersect_prev === undefined
		// 	? Infinity
		// 	: ear.math.distance2(vertex_ray_intersect_prev, graph.vertices_coords[vertex]);
		// const vertices_ray_intersect_next_dist = vertex_ray_intersect_next === undefined
		// 	? Infinity
		// 	: ear.math.distance2(vertex_ray_intersect_next, graph.vertices_coords[vertex]);
		// const vertices_ray_intersect_next_or_prev = vertices_ray_intersect_prev_dist
		// 	> vertices_ray_intersect_next_dist;

		// console.log("vertex_edges_vertices", vertex_edges_vertices);
		// console.log("vertex_edges_vecs", vertex_edges_vecs);

		// vertices
		// vertices_edges_vertices
		// vertices_ray
		// vertices_ray_intersect_prev
		// vertices_ray_intersect_next
		// vertices_ray_intersect_prev_dist
		// vertices_ray_intersect_next_dist
		// vertices_ray_intersect_next_or_prev

		// now
		// const intersections_vertices = vertex_ray_intersect_next_or_prev
		//   && !(arr[(i + 1) % arr.length])
		// ? i
		// : undefined)
		// .filter(a => a !== undefined)
		// .map(v => [v, (v + 1) % vertices_coords.length]);

		// intersections_vertices
		// intersections_point
		// intersections_sides
		// intersections_sides_projections_t
		// intersections_sides_projections_valid
		// intersections_sides_projections
		// intersections_sides_projection_dist
		// intersections_smallest_dist
	}

	// const skeleton = {
	// 	vertices_coords: graph.vertices_coords,
	// 	edges_vertices,
	// 	edges_assignment,
	// };

	// drawLayer.origami(skeleton);
};

// const example1 = [[90,37.17],[86.04,69.81],[69.43,53.4],[55.66,60.75],[48.87,81.7],[36.98,55.47],[29.25,87.17],[6.79,14.53],[64.72,23.21]];
const example1 = [
	[68.12, 38.31],
	[89.76, 20.34],
	[89.76, 60.72],
	[54.78, 66.52],
	[55.36, 78.89],
	[16.71, 58.79],
	[25.99, 10.29],
];

svg.controls(7)
	.position((_, i) => example1[i])
// 	.position(() => [svg.getWidth(), svg.getHeight()]
// 		.map(n => n * Math.random()))
	.svg(() => svg.circle(1).fill("lightgray").setClass("fill-red"))
	.onChange((p, i, points) => {
		drawLayer.removeChildren();
		polygon.setPoints(points);
		points.forEach((point, j) => drawLayer
			.text(`${j}`, ...point)
			.fontSize(7)
			.fontFamily("Avenir Next"));
		straightSkeleton(points);
		// console.log(points.map(p => p.map(n => parseFloat(n.toFixed(2)))));
	}, true);
