
export const EPSILON_LOW  = 3e-6;
export const EPSILON      = 1e-10;
export const EPSILON_HIGH = 1e-14;

/** clean floating point numbers
 *  example: 15.0000000000000002 into 15
 * the adjustable epsilon is default 15, Javascripts 16 digit float
 */
export function clean_number(num, decimalPlaces = 15) {
	// todo, this fails when num is a string, consider checking
	return (num == null
		? undefined
		: parseFloat(num.toFixed(decimalPlaces)));
}