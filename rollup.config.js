import cleanup from "rollup-plugin-cleanup";
// import babel from "rollup-plugin-babel";
// import { terser } from "rollup-plugin-terser";

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
    cleanup({
      comments: "none",
      maxEmptyLines: 0,
    }),
    // babel({
    //   babelrc: false,
    //   presets: [["@babel/env", { modules: false }]],
    // }),
    // terser(),
  ]
}];
