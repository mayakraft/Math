import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

const input = "src/index.js";
const name = "math";
const banner = "/* Math (c) Kraft, MIT License */";

export default [{
	input,
	output: {
		name,
		file: "math.js",
		format: "umd",
		banner,
	},
	plugins: [cleanup(), terser()],
}, {
	input,
	output: {
		name,
		file: "math.module.js",
		format: "es",
		banner,
	},
	plugins: [cleanup()],
}, {
	input,
	output: {
		name,
		file: "math.module.comments.js",
		format: "es",
		banner,
	},
}];
