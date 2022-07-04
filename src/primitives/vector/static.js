/**
 * Math (c) Kraft
 */
import Constructors from "../constructors";
import { D2R } from "../../algebra/constants";

const VectorStatic = {
	fromAngle: function (angle) {
		return Constructors.vector(Math.cos(angle), Math.sin(angle));
	},
	fromAngleDegrees: function (angle) {
		return Constructors.vector.fromAngle(angle * D2R);
	},
};

export default VectorStatic;
