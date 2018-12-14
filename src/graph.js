
import { line_line, point_on_line, line_edge_exclusive } from './intersection'


export function split_convex_polygon_combinatoric(graph, faceIndex, linePoint, lineVector){
	let vertices_coords = graph.vertices_coords;
	let edges_vertices = graph.edges_vertices;

	let face_vertices = graph.faces_vertices[faceIndex];
	let face_edges = graph.faces_edges[faceIndex];

	let diff = {
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
		.map((point, i) => ({point: point, at_index: i }))
		.filter(el => el.point != null);

	// in the case of edges_intersections, we have new vertices, edges, and faces
	// otherwise in the case of only vertices_intersections, we only have new faces
	diff.vertices = {};
	diff.vertices.new = edges_intersections.map(el => el.point)

	diff.edges = {};
	diff.edges.substitute = edges_intersections
		.map((el, i) => {
			let newEdges = [
				[face_edges[el.at_index][0], vertices_coords.length + i],
				[vertices_coords.length + i, face_edges[el.at_index][1]]
			];
			return {
				old_index: el.at_index,
				new_edges: newEdges
			};
		});

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

		let face_a = face_vertices
			.slice(sorted_edges[1].at_index+1)
			.concat(face_vertices.slice(0, sorted_edges[0].at_index+1))
			.concat(face_a_vertices_end);
		let face_b = face_vertices
			.slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1)
			.concat(face_b_vertices_end);

		diff.faces = {};
		diff.faces.replace = {
			old_index: faceIndex,
			new_faces: [face_a, face_b]
		}
		return diff;

	} else if(edges_intersections.length == 1 && vertices_intersections.length == 1){

		vertices_intersections[0]["type"] = "v";
		edges_intersections[0]["type"] = "e";
		let sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a,b) => a.at_index - b.at_index);

		let face_a = poly.slice(sorted_geom[1].at_index+1)
			.concat(poly.slice(0, sorted_geom[0].at_index+1))
		if(sorted_geom[0].type === "e"){ face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point);

		let face_b = poly
			.slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
		if(sorted_geom[1].type === "e"){ face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point);
		return [face_a, face_b];

	} else if(vertices_intersections.length == 2){

		let sorted_vertices = vertices_intersections.slice()
			.sort((a,b) => a.at_index - b.at_index);
		let face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index+1))
		let face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
		return [face_a, face_b];

	}
	return [poly.slice()];
}
