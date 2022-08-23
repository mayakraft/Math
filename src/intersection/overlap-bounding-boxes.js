/**
 * Math (c) Kraft
 */
/**
 * @description Test if two axis-aligned bounding boxes overlap each other.
 * @param {BoundingBox} box1 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @param {BoundingBox} box2 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @returns {boolean} true if the bounding boxes overlap each other
 * @linkcode Math ./src/intersection/overlap-bounding-boxes.js 9
 */
const overlapBoundingBoxes = (box1, box2) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		// if one minimum is above the other's maximum, or visa versa
		if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
			return false;
		}
	}
	return true;
};

export default overlapBoundingBoxes;
