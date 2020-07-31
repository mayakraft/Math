/**
 * type checking
 */
/**
 * one way to improve these input finders is to search in all indices
 * of the arguments list, right now it assumes THIS is the only thing
 * you're passing in. in the case that it isn't and there's an object
 * in the first slot, it won't find the valid data in the second.
 */
const type_of = function (obj) {
  switch (obj.constructor.name) {
    case "vector":
    case "matrix":
    case "segment":
    case "ray":
    case "line":
    case "circle":
    case "ellipse":
    case "rect":
    case "polygon": return obj.constructor.name;
    default: break;
  }
  if (typeof obj === "object") {
    if (obj.radius != null) { return "circle"; }
    if (obj.width != null) { return "rect"; }
    if (obj.x != null || typeof obj[0] === "number") { return "vector"; }
    // line ray segment
    if (obj[0] != null && obj[0].length && (typeof obj[0].x === "number" || typeof obj[0][0] === "number")) { return "segment"; }
    if (obj.vector != null && obj.origin != null) { return "line"; } // or ray
  }
  return undefined;
};

export default type_of;
