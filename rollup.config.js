// import minify from 'rollup-plugin-babel-minify';

module.exports = {
	input: 'src/public.js',
	output: {
		name: 'Geometry',
		file: 'geometry.js',
		format: 'umd',
		// format: 'es',
		banner: "/* Geometry (c) Robby Kraft, MIT License */"
	},
	// plugins: [
	// 	minify( {
	// 		bannerNewLine: true,
	// 		comments: false
	// 	} )
	// ]
};
