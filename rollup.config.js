import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

module.exports = [{
  input: "src/index.js",
  output: {
    name: "math",
    file: "math.js",
    format: "umd",
    // format: "es",
    banner: "/* Math (c) Robby Kraft, MIT License */",
  },
  plugins: [
    // babel({
			// babelHelpers: "bundled",
			// presets: ["@babel/preset-env"]
    // }),
    cleanup(),
    // terser(),
  ]
}];
