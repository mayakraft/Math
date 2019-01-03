// convenience
function equivalent(a, b){ return Math.abs(a-b) < 1e-13; }
let Vector = Geometry.Vector;
let Matrix = Geometry.Matrix;
let Line = Geometry.Line;
let Polygon = Geometry.Polygon;
let ConvexPolygon = Geometry.ConvexPolygon;

// all tests as objects: {
//    test: __boolean__,
//    name: __string__
//  }
let tests = [];
function test(t, name){ tests.push({test: t, name: name}); }


// 1. 2 vectors at 90 degrees: dot and cross
let v1 = Vector(Math.random()*2-1, Math.random()*2-1).normalize();
let v190 = v1.rotateZ90();
test(equivalent(v1.dot(v190), 0), "dot right angle");
test(equivalent(v1.cross(v190).magnitude(), 1), "cross right angle");

// 2. vector normalize, magnitude
let v2 = Vector(10,10).normalize().scale(2);
test(equivalent(v2.x, Math.sqrt(2)), "vector normalize, magnitude");

// 3. parallel
let v3a = Vector(3,4);
let v3b = Vector(-6,-8);
test(v3a.isParallel(v3b), "vector parallel");
let l3a = Line(100,101,3,4);
let l3b = Line(5,5,-6,-8);
test(l3a.isParallel(l3b), "line parallel");

// 4. equivalent
let v4a = Vector(3,4).normalize();
let v4b = Vector(6,8).normalize();
test(v4a.isEquivalent(v4b), "vectors equivalent");

// 5. intersection
let line1 = Line(0,0,1,1);
let line2 = Line(10,0,-1,1);

console.log(line1);
// line1.intersection(line2)

// 5. polygon
let poly1 = Polygon.regularPolygon(4);
// poly1.clipLine(line1);

let poly2 = ConvexPolygon.regularPolygon(4);
// console.log(poly1);
console.log(poly2);
let clip1 = poly2.clipLine(line1);
console.log(clip1);



// check all tests
let allTests = tests.reduce((prev, curr) => prev && curr.test, true);
let result = allTests
	? "all tests pass"
	: "error with tests:<ul><li>"
		+ tests.filter(t=>!t.test).map(t=>t.name).join("</li><li>")
		+ "</li></ul>";
document.body.innerHTML = result;
