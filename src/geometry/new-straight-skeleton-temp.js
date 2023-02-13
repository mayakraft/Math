
const build = (startPolygon) => {
	const vertices_coords = [...startPolygon];
	const polygon_vertices = vertices_coords.map((_, i) => i);
	const vertices_edges_vertices = vertices_coords
		.map((v, i, a) => [
			[v, a[(i + a.length - 1) % a.length]],
			[v, a[(i + 1) % a.length]]
		]);
	const vertices_ray = vertices_edges_vertices
		.map(sides => sides
			.map(verts => ear.math.subtract2(verts[1], verts[0]))
			.map(vec => ear.math.normalize2(vec)))
		.map(vecs => ear.math.clockwiseBisect2(vecs[0], vecs[1]))
		.map((vec, i) => ear.ray(vec, vertices_coords[i]));
	// figure out which of these intersections intersect with
	// their neighbors and determine a start for the skeleton
	const vertices_ray_intersect_prev = vertices_ray
		.map((ray, i, arr) => ear
			.intersect(arr[(i + arr.length - 1) % arr.length], ray));
	const vertices_ray_intersect_next = vertices_ray
		.map((ray, i, arr) => ear.intersect(ray, arr[(i + 1) % arr.length]));
	const vertices_ray_intersect_prev_dist = vertices_ray_intersect_prev
		.map((intersect, i, arr) => intersect === undefined
			? Infinity
			: ear.math.distance2(intersect, vertices_coords[i]));
	const vertices_ray_intersect_next_dist = vertices_ray_intersect_next
		.map((intersect, i, arr) => intersect === undefined
			? Infinity
			: ear.math.distance2(intersect, vertices_coords[i]));
	// which is the shortest distance. false is prev, true is next
	const vertices_ray_intersect_next_or_prev = vertices_ray_intersect_prev_dist
		.map((prev, i) => prev > vertices_ray_intersect_next_dist[i]);
	// these are the contenders for the next skeleton branch
	const intersections_vertices = vertices_ray_intersect_next_or_prev
		.map((norp, i, arr) => norp && !(arr[(i + 1) % arr.length]) ? i : undefined)
		.filter(a => a !== undefined)
		.map(v => [v, (v + 1) % vertices_coords.length]);
	const intersections_point = intersections_vertices
		.map(verts => vertices_ray_intersect_next[verts[0]]);
	const intersections_sides = intersections_vertices
		.map(verts => [
			[...verts], // base side
			[verts[0], (verts[0] + vertices_coords.length - 1) % vertices_coords.length], // prev side
			[verts[1], (verts[1] + 1) % vertices_coords.length], // next side
		]);
	const intersections_sides_projections_t = intersections_sides
		.map((sides, i) => sides
			.map(pair => pair.map(v => vertices_coords[v]))
			.map(verts => projectPointOnLine(
				ear.math.subtract2(verts[1], verts[0]),
				verts[0],
				intersections_point[i],
			)));
	const intersections_sides_projections_valid = intersections_sides_projections_t
		.map(sides => sides
			.map(t => t >= 0 && t <= 1));
	const intersections_sides_projections = intersections_sides_projections_t
		.map((sides, i) => sides
			.map((t, j) => ear.math.add2(
				vertices_coords[intersections_sides[i][j][0]],
				ear.math.scale2(ear.math.subtract2(
					vertices_coords[intersections_sides[i][j][1]],
					vertices_coords[intersections_sides[i][j][0]],
				), t))));
	const intersections_sides_projection_dist = intersections_sides_projections
		.map((points, i) => ear.math.distance2(intersections_point[i], points[0]));
	const intersections_smallest_dist = intersections_sides_projection_dist
		.map((d, i) => ({ d, i }))
		.sort((a, b) => a.d - b.d)
		.map(el => el.i)
		.shift();
	
	if (intersections_smallest_dist !== undefined) {
		const inter = intersections_smallest_dist;
		const removeVertices = intersections_sides[inter][0];
		// increment vertices length. new vertex is at the end
		vertices_coords.push(intersections_point[inter]);
		const vertex = vertices_coords.length - 1;
		// modify polygon, remove 2 vertices. add 1.
		// todo: do this without indexOf (can be circular)
		polygon_vertices.splice(polygon_vertices.indexOf(removeVertices[0]), 1, vertex);
		polygon_vertices.splice(polygon_vertices.indexOf(removeVertices[1]), 1);
		const poly_vert_index = polygon_vertices.indexOf(vertex);

		// build new vertex data
		const vertex_edges_vertices = [
			intersections_sides[inter][1],
			intersections_sides[inter][2],
		];
		const vertex_edges_vecs = vertex_edges_vertices
			.map(verts => ear.math.subtract2(verts[1], verts[0]))
			.map(vec => ear.math.normalize2(vec));
		const vertex_ray = ear.ray(
			ear.math.clockwiseBisect2(vertex_edges_vecs[0], vertex_edges_vecs[1]),
			vertices_coords[vertex]);
		const vertex_ray_intersect_prev = ear.intersect(
			vertices_ray[(poly_vert_index + polygon_vertices.length - 1) % polygon_vertices.length],
			vertex_ray);
		const vertex_ray_intersect_next = ear.intersect(
			vertex_ray,
			vertices_ray[(poly_vert_index + 1) % polygon_vertices.length]);
		const vertices_ray_intersect_prev_dist = vertex_ray_intersect_prev === undefined
			? Infinity
			: ear.math.distance2(vertex_ray_intersect_prev, vertices_coords[vertex]);
		const vertices_ray_intersect_next_dist = vertex_ray_intersect_next === undefined
			? Infinity
			: ear.math.distance2(vertex_ray_intersect_next, vertices_coords[vertex]);
		const vertices_ray_intersect_next_or_prev = vertices_ray_intersect_prev_dist > vertices_ray_intersect_next_dist;
		// vertices
		// vertices_edges_vertices
		// vertices_ray
		// vertices_ray_intersect_prev
		// vertices_ray_intersect_next
		// vertices_ray_intersect_prev_dist
		// vertices_ray_intersect_next_dist
		// vertices_ray_intersect_next_or_prev
		
		// now
	//   const intersections_vertices = vertex_ray_intersect_next_or_prev
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

// 	console.log("intersections_vertices", intersections_vertices);
// 	console.log("intersections_point", intersections_point);
// 	console.log("intersections_sides", intersections_sides);
// 	console.log("intersections_sides_projections_t", intersections_sides_projections_t);
// 	console.log("intersections_sides_projections", intersections_sides_projections);
// 	console.log("intersections_sides_projection_dist", intersections_sides_projection_dist);
// 	console.log("intersections_smallest_dist", intersections_smallest_dist);

	vertices_ray_intersect_prev
		.forEach((inter, v) => inter === undefined
			? {}
			: drawLayer.line(inter, vertices_coords[v])
			.stroke("lightgray"));

	vertices_ray
		.map(ray => ray.scale(10))
		.forEach(ray => drawLayer
			.arrow(ray.origin, ray.origin.add(ray.vector))
			.head({ width: 4, height: 5 })
			.stroke("blue")
			.fill("blue"));
	
	intersections_point
		.forEach(p => drawLayer.circle(p).radius(2).fill("lightblue"));

	intersections_vertices
		.map(verts => verts.map(v => vertices_coords[v]))
		.forEach((seg, i) => seg
			.forEach(point => drawLayer.line(point, intersections_point[i])
				.stroke("purple")
				.strokeDasharray("1 1")));

	intersections_sides_projections
		.forEach((sides, i) => sides
			.forEach((point, j) => drawLayer
				.circle(point)
				.radius(2)
				.fill(intersections_sides_projections_valid[i][j] ? "orange" : "lightgray")));
};
