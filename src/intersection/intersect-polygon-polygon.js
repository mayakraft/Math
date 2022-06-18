/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
/**
 * Sutherland-Hodgman polygon clipping
 * from Rosetta Code
 * refactored to use this library, and include an epsilon
 * 
 * the epsilon is hard-coded to be exclusive. two polygons sharing an
 * edge will return nothing
 *
 * polygons must be counter-clockwise!
 * will not work even if both are similarly clockwise.
 *
 * https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 */
const intersectPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	var cp1, cp2, s, e;
	const inside = (p) => {
		// console.log(p, "inside", ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
		// 	> ((cp2[1] - cp1[1]) * (p[0] - cp1[0])));
		return ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
			> ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon);
	};
	const intersection = () => {
		var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
			dp = [ s[0] - e[0], s[1] - e[1] ],
			n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
			n2 = s[0] * e[1] - s[1] * e[0], 
			n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
			// console.log("intersection res", [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3]);
		return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
	};
	var outputList = polygon1;
	cp1 = polygon2[polygon2.length-1];
	for (var j in polygon2) {
		cp2 = polygon2[j];
		var inputList = outputList;
		outputList = [];
		s = inputList[inputList.length - 1];
		for (var i in inputList) {
			e = inputList[i];
			if (inside(e)) {
				if (!inside(s)) {
					outputList.push(intersection());
				}
				outputList.push(e);
			}
			else if (inside(s)) {
				outputList.push(intersection());
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};

export default intersectPolygonPolygon;
