
export function is_number(n) {
	return n != null && !isNaN(n);
}

/** clean floating point numbers
 *  example: 15.0000000000000002 into 15
 * the adjustable epsilon is default 15, Javascripts 16 digit float
 */
export function clean_number(num, decimalPlaces = 15){
	if (num == undefined) { return undefined; }
	return parseFloat(num.toFixed(decimalPlaces));
}

/** 
 * this searches user-provided inputs for a valid n-dimensional vector 
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 * 
 * @returns (number[]) array of number components
 *   invalid/no input returns an emptry array
*/
export function get_vec(){
	let params = Array.from(arguments);
	if(params.length == 0) { return []; }
	if(params[0].vector != null && params[0].vector.constructor == Array){
		return params[0].vector; // Vector type
	}
	let arrays = params.filter((param) => param.constructor === Array);
	if(arrays.length >= 1) { return arrays[0]; }
	let numbers = params.filter((param) => !isNaN(param));
	if(numbers.length >= 1) { return numbers; }
	if(!isNaN(params[0].x)){
		// todo, we are relying on convention here. should 'w' be included?
		// todo: if y is not defined but z is, it will move z to index 1
		return ['x','y','z'].map(c => params[0][c]).filter(a => a != null);
	}
	return [];
}

/** 
 * this searches user-provided inputs for a valid n-dimensional vector 
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 * 
 * @returns (number[]) array of number components
 *  invalid/no input returns the identity matrix
*/
export function get_matrix(){
	let params = Array.from(arguments);
	let numbers = params.filter((param) => !isNaN(param));
	let arrays = params.filter((param) => param.constructor === Array);
	if(params.length == 0) { return [1,0,0,1,0,0]; }
	if(params[0].m != null && params[0].m.constructor == Array){
		numbers = params[0].m.slice(); // Matrix type
	}
	if(numbers.length == 0 && arrays.length >= 1){ numbers = arrays[0]; }
	if(numbers.length >= 6){ return numbers.slice(0,6); }
	else if(numbers.length >= 4){
		let m = numbers.slice(0,4);
		m[4] = 0;
		m[5] = 0;
		return m;
	}
	return [1,0,0,1,0,0];
}

/** 
 * this searches user-provided inputs for a valid n-dimensional vector 
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 * 
 * @returns ({ point:[], vector:[] })
*/
export function get_line(){
	let params = Array.from(arguments);
	if(params.length == 0) { return {vector: [], point: []}; }
	// let numbers = params.filter((param) => !isNaN(param));
	// if(numbers.length >= 1) { return numbers; }
	if(params[0].constructor === Array){
		// if(params[0].length == 2){ }
		// Vector(line.nodes[1].x, line.nodes[1].y).subtract(origin)
	}
	if(params[0].constructor === Object){
		let vector = [], point = [];
		if (params[0].vector != null)         { vector = get_vec(params[0].vector); }
		else if (params[0].direction != null) { vector = get_vec(params[0].direction); }
		if (params[0].point != null)       { point = get_vec(params[0].point); }
		else if (params[0].origin != null) { point = get_vec(params[0].origin); }
		return {vector, point};
	}
	return {vector: [], point: []};
}
