// import minify from "rollup-plugin-babel-minify";
import cleanup from "rollup-plugin-cleanup";

module.exports = {
	input: "src/index.js",
	output: {
		name: "Geometry",
		file: "geometry.js",
		format: "umd",
		// format: "es",
		banner: "/* Geometry (c) Robby Kraft, MIT License */"
	},
	plugins: [
	cleanup({
		comments: "none",
		maxEmptyLines: 0
	}),
	// 	minify( {
	// 		bannerNewLine: true,
	// 		comments: false
	// 	} )
	]
};
