import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

const name = "math";
const banner = "/* Math (c) Robby Kraft, MIT License */";

module.exports = [{
  input: "src/index.js",
  output: [{
    name,
    file: "math.js",
    format: "umd",
    banner,
  }, {
    name,
    file: "math.es6.js",
    format: "es",
    banner,
  }],
  plugins: [
    // babel({
			// babelHelpers: "bundled",
			// presets: ["@babel/preset-env"]
    // }),
    cleanup(),
    // terser(),
  ]
}];
