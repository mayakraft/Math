import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

const input = "src/index.js";
const name = "math";
const banner = "/* Math (c) Kraft, MIT License */";

module.exports = [{
	input,
	output: {
		name,
		file: "math.es6.js",
		format: "es",
		banner,
	},
}, {
	input,
	output: {
		name,
		file: "math.js",
		format: "umd",
		banner,
	},
	plugins: [
		babel({
			babelHelpers: "bundled",
			presets: ["@babel/preset-env"]
		}),
		cleanup(),
		terser(),
	]
}];
