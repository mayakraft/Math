/**
 * Math (c) Kraft
 */
import { getVector } from "../../types/get.js";

const VectorArgs = function () {
	this.push(...getVector(arguments));
};

export default VectorArgs;
