
import { line_line, point_on_line, line_edge_exclusive } from './intersection'


export function split_convex_polygon_combinatoric(graph, faceIndex, linePoint, lineVector){
	let vertices_coords = graph.vertices_coords;
	let edges_vertices = graph.edges_vertices;

	let face_vertices = graph.faces_vertices[faceIndex];
	let face_edges = graph.faces_edges[faceIndex];

	let diff = {
		edges: {}
	// 	changedVertices,
	// 	changedEdges,
	// 	did the face change?
	};

	//    point: intersection [x,y] point or null if no intersection
	// at_index: where in the polygon this occurs
	let vertices_intersections = face_vertices
		.map(fv => vertices_coords[fv])
		.map(v => point_on_line(linePoint, lineVector, v) ? v : null)
		.map((point, i) => ({ point: point, at_index: i }))
		.filter(el => el.point != null);

	// let edges_intersections = face_vertices
	// 	.map(fv => vertices_coords[fv])
	// 	.map((v, i, arr) => line_edge_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length]))
	// 	.map((point, i) => ({point: point, at_index: i }))
	// 	.filter(el => el.point != null);

	let edges_intersections = face_edges
		.map(ei => edges_vertices[ei])
		.map(edge => edge.map(e => vertices_coords[e]))
		.map(edge => line_edge_exclusive(linePoint, lineVector, edge[0], edge[1]))
		.map((point, i) => ({point: point, at_index: i, at_real_index: face_edges[i] }))
		.filter(el => el.point != null);

	// in the case of edges_intersections, we have new vertices, edges, and faces
	// otherwise in the case of only vertices_intersections, we only have new faces
	if(edges_intersections.length > 0){
		diff.vertices = {};
		diff.vertices.new = edges_intersections.map(el => el.point)
	}
	if(edges_intersections.length > 0){
		diff.edges.replace = edges_intersections
			.map((el, i) => {
				let newEdges = [
					[edges_vertices[face_edges[el.at_index]][0], vertices_coords.length + i],
					[vertices_coords.length + i, edges_vertices[face_edges[el.at_index]][1]]
				];
				return {
					// old_index: el.at_index,
					old_index: el.at_real_index,
					new: newEdges
				};
			});
	}

	let face_a, face_b, new_edge;
	// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
	if(edges_intersections.length == 2){
		let in_order = (edges_intersections[0].at_index < edges_intersections[1].at_index);

		let sorted_edges = edges_intersections.slice()
			.sort((a,b) => a.at_index - b.at_index);

		// these are new vertices
		let face_a_vertices_end = in_order
			? [vertices_coords.length, vertices_coords.length+1]
			: [vertices_coords.length+1, vertices_coords.length];
		let face_b_vertices_end = in_order
			? [vertices_coords.length+1, vertices_coords.length]
			: [vertices_coords.length, vertices_coords.length+1];

		face_a = face_vertices
			.slice(sorted_edges[1].at_index+1)
			.concat(face_vertices.slice(0, sorted_edges[0].at_index+1))
			.concat(face_a_vertices_end);
		face_b = face_vertices
			.slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1)
			.concat(face_b_vertices_end);
		new_edge = [vertices_coords.length, vertices_coords.length+1];

	} else if(edges_intersections.length == 1 && vertices_intersections.length == 1){
		vertices_intersections[0]["type"] = "v";
		edges_intersections[0]["type"] = "e";
		let sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a,b) => a.at_index - b.at_index);

		let face_a_vertices_end = sorted_geom[0].type === "e"
			? [vertices_coords.length, sorted_geom[1].at_index]
			: [vertices_coords.length];
		let face_b_vertices_end = sorted_geom[1].type === "e"
			? [vertices_coords.length, sorted_geom[0].at_index]
			: [vertices_coords.length];

		face_a = face_vertices.slice(sorted_geom[1].at_index+1)
			.concat(face_vertices.slice(0, sorted_geom[0].at_index+1))
			.concat(face_a_vertices_end);
		face_b = face_vertices
			.slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1)
			.concat(face_b_vertices_end);
		new_edge = [vertices_intersections[0].at_index, vertices_coords.length];

	} else if(vertices_intersections.length == 2){
		let sorted_vertices = vertices_intersections.slice()
			.sort((a,b) => a.at_index - b.at_index);
		face_a = face_vertices
			.slice(sorted_vertices[1].at_index)
			.concat(face_vertices.slice(0, sorted_vertices[0].at_index+1))
		face_b = face_vertices
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
		new_edge = sorted_vertices.map(el => el.at_index);

	}
	diff.edges.new = [new_edge];
	diff.faces = {};
	diff.faces.replace = [{
		old_index: faceIndex,
		new: [face_a, face_b]
	}];
	return diff;
}


// export function applyDiff(graph, diff){

// }

// export function replaceEdge(graph, replace){

// }
