/**
 * Math (c) Kraft
 */
import * as constants from "./constants.js";
import * as mathFunctions from "./functions.js";
import * as getMethods from "./get.js";
import * as convertMethods from "./convert.js";
import * as arrayMethods from "./arrays.js";
import * as numberMethods from "./numbers.js";
import * as searchMethods from "./search.js";
import * as sortMethods from "./sort.js";

export default {
	...constants,
	...mathFunctions,
	...getMethods,
	...convertMethods,
	...arrayMethods,
	...numberMethods,
	...searchMethods,
	...sortMethods,
};
