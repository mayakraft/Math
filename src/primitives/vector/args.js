/**
 * Math (c) Kraft
 */
import { getVector } from "../../types/get";

const VectorArgs = function () {
	this.push(...getVector(arguments));
};

export default VectorArgs;
