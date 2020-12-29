/**
 * Rabbit Ear (c) Robby Kraft
 */
import { EPSILON } from "./constants";
import Constructors from "../primitives/constructors";
import { resize_up } from "../arguments/resize";
import {
  normalize,
  midpoint,
  distance,
  subtract,
  rotate90,
} from "./algebra";
import {
  bisect_lines2,
} from "./radial";
import {
  intersect_circle_line,
} from "../intersection/circle";
import {
  include_l,
  intersect_lines,
} from "../intersection/lines";
import { solveCubic } from "./solvers";

/*           _                       _              _
            (_)                     (_)            (_)
   ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
  / _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
  \___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
                __/ |
               |___/
*/
export const axiom1 = (pointA, pointB) => Constructors.line(
  normalize(subtract(...resize_up(pointB, pointA))),
  pointA
);

export const axiom2 = (pointA, pointB) => Constructors.line(
  normalize(rotate90(subtract(...resize_up(pointB, pointA)))),
  midpoint(pointA, pointB)
);
// make sure these all get a resize_up or whatever is necessary
export const axiom3 = (vectorA, originA, vectorB, originB) => bisect_lines2(
    vectorA, originA, vectorB, originB).map(Constructors.line);
/**
 * axiom 4
 * @description create a line perpendicular to a vector through a point
 * @param {number[]} the vector of the line
 * @param {number[]} the point
 * @returns {line} axiom 4 result
 */
export const axiom4 = (vector, point) => Constructors.line(
  rotate90(normalize(vector)),
  point
);

export const axiom5 = (vectorA, originA, pointA, pointB) => (intersect_circle_line(
    distance(pointA, pointB),
    pointA,
    vectorA,
    originA,
    () => true
  ) || []).map(sect => Constructors.line(
    normalize(rotate90(subtract(...resize_up(sect, pointB)))),
    midpoint(pointB, sect)
  ));

/**
 * @description axiom 7: make a crease by bringing a point (pointC) onto a
 *  line () perpendicular to another line ()
 * @param {number[]} vector of the first line
 * @param {number[]} origin of the first line
 * @param {number[]} vector of the second line (origin is not needed)
 * @param {number[]} point involved in the folding
 */
export const axiom7 = (vectorA, originA, vectorB, pointC) => {
  const intersect = intersect_lines(vectorA, originA, vectorB, pointC, include_l, include_l);
  return intersect === undefined
    ? undefined
    : Constructors.line(
        normalize(rotate90(subtract(...resize_up(intersect, pointC)))),
        midpoint(pointC, intersect)
    );
};

// function (point1, point2, line1, line2){
// export const axiom6 = function (pointA, vecA, pointB, vecB, pointC, pointD) {
export const axiom6 = function (vecA, pointA, vecB, pointB, pointC, pointD) {
  var p1 = pointC[0];
  var q1 = pointC[1];
  // find equation of line in form y = mx+h (or x = k)
  if (Math.abs(vecA[0]) > EPSILON) {
    var m1 = vecA[1] / vecA[0];
    var h1 = pointA[1] - m1 * pointA[0];
  }
  else {
    var k1 = pointA[0];
  }

  var p2 = pointD[0];
  var q2 = pointD[1];
  // find equation of line in form y = mx+h (or x = k)
  if (Math.abs(vecB[0]) > EPSILON) {
    var m2 = vecB[1] / vecB[0];
    var h2 = pointB[1] - m2 * pointB[0];
  }
  else {
    var k2 = pointB[0];
  }

  //equation of perpendicular bisector between (p,q) and (u, v)
  //  {passes through ((u+p)/2,(v+q)/2) with slope -(u-p)/(v-q)}
  //y = (-2(u-p)x + (v^2 -q^2 + u^2 - p^2))/2(v-q)

  //equation of perpendicular bisector between (p,q) and (u, mu+h)
  // y = (-2(u-p)x + (m^2+1)u^2 + 2mhu + h^2-p^2-q^2)/(2mu + 2(h-q))

  //equation of perpendicular bisector between (p,q) and (k, v)
  //y = (-2(k-p)x + (v^2 + k^2-p^2-q^2))/2(v-q)

  // if the two bisectors are the same line,
  // then the gradients and intersections of both lines are equal

  //case 1: m1 and m2 both defined
  if (m1 !== undefined && m2 !== undefined) {
    //1: (u1-p1)/(m1u1+(h1 -q1)) = (u2-p2)/(m2u2+(h2-q2))
    //and
    //2: (a1u1^2+b1u1+ c1)/(d1u1+e1) = (a2u2^2+b2u2+c2)/(d2u2+e2)
    //where
    //an = mn^2+1
    //bn = 2mnhn
    //cn = hn^2-pn^2-qn^2
    //dn = 2mn
    //en = 2(hn-qn)

    var a1 = m1*m1 + 1;
    var b1 = 2*m1*h1;
    var c1 = h1*h1 - p1*p1 - q1*q1;
    //var d1 = 2*m1;
    //var e1 = 2*(h1 - q1);

    var a2 = m2*m2 + 1;
    var b2 = 2*m2*h2;
    var c2 =  h2*h2 - p2*p2 - q2*q2;
    //var d2 = 2*m2;
    //var e2 = 2*(h2 - q2);

    //rearrange 1 to express u1 in terms of u2
    //u1 = (a0u2+b0)/(c0u2+d0)
    //where
    //a0 = m2p1-(q1-h1)
    //b0 = p2(q1-h1)-p1(q2-h2)
    //c0= m2-m1
    //d0= m1p2-(q2-h2)
    var a0 = m2*p1 + (h1 - q1);
    var b0 = p1*(h2 - q2) - p2*(h1 - q1);
    var c0 = m2 - m1;
    var d0 = m1*p2 + (h2 - q2);

    var z = m1*p1 + (h1 - q1);
    //subsitute u1 into 2 and solve for u2:
  }
  else if (m1 === undefined && m2 === undefined) {
    //1: (k1-p1)/(v1 -q1)) = (k2-p2)/(v2-q2)
    //and
    //2: (v1^2+c1)/(d1v1+e1) = (v2^2+c2)/(d2u2+e2)
    //where
    //cn = kn^2-pn^2-qn^2
    //dn = 2
    //en = -2qn

    a1 = 1;
    b1 = 0;
    c1 = k1*k1 - p1*p1 - q1*q1;
    //d1 = 2;
    //e1 = -2*q1;

    a2 = 1;
    b2 = 0;
    c2 = k2*k2 - p2*p2 - q2*q2;
    //d2 = 2;
    //e2 = -2*q2;

    //rearrange 1 to express v1 in terms of v2
    //v1 = (a0v2+b0)/d0
    //where
    //a0 =k1-p1
    //b0 = q1(k2-p2)-q1(k1-p1)
    //d0= k2-p2
    a0 = k1 - p1;
    b0 = q1*(k2 - p2) - q2*(k1 - p1);
    c0 = 0;
    d0 = k2 - p2;

    z = a0;
    //subsitute v1 into 2 and solve for v2:
  }
  else {
    if (m1 === undefined) {
      //swap the order of the points and lines
      var p3 = p1;
      p1 = p2;
      p2 = p3;
      var q3 = q1;
      q1 = q2;
      q2 = q3;
      m1 = m2;
      m2 = undefined;
      h1 = h2;
      h2 = undefined;
      k2 = k1;
      k1 = undefined;
    }

    //1: (u1-p1)/(m1u1+(h1 -q1))  = (k2-p2)/(v2-q2)
    //and
    //2: (a1u1^2+b1u1+ c1)/(d1u1+e1) =  (v2^2+c2)/(d2u2+e2)
    //where
    //a1 = m1^2+1
    //b1 = 2m1h1
    //c1 = h1^2-p1^2-q1^2
    //d1 = 2m1
    //e1 = 2(h1-q1)
    //c2 = k2^2-p2^2-q2^2
    //d2 = 2
    //e2 = -2q2

    a1 = m1*m1 + 1;
    b1 = 2*m1*h1;
    c1 = h1*h1 - p1*p1 - q1*q1;
    //d1 = 2*m1;
    //e1 = 2*(h1 - q1);

    a2 = 1;
    b2 = 0;
    c2 = k2*k2 - p2*p2 - q2*q2;
    //d2 = 2;
    //e2 = -2*q2;

    //rearrange 1 to express u1 in terms of v2
    //u1 = (a0v2+b0)/(v2+d0)
    //where
    //a0 = p1
    //b0 = (h1-q1)(k2-p2) - p1q1
    //d0= -m1(k2-p2)-q2
    a0 = p1;
    b0 = (h1 - q1)*(k2 - p2) - p1*q2;
    c0 = 1;
    d0 = -m1*(k2 - p2) - q2;

    z = m1*p1 + (h1 - q1);
    //subsitute u1 into 2 and solve for v2:
  }

  //subsitute into 3:
  //4: (a3x^2 + b3x + c3)/(d3x^2 + e3x + f3) = (a2x^2 + b2x + c2)/(d2x + e2)
  //where
  //a3 = a1a0^2+b1a0c0+c1c0^2
  //b3 = 2a1a0b0+b1(a0d0+b0c0)+2c1c0d0
  //c3 = a1b0^2+b1b0d0+c1d0^2
  //d3 =c0(d1a0+e1c0) = d2c0z
  //e3 = d0(d1a0+e1c0)+c0(d1b+e1d) = (d2d0+e2c0)z
  //f3 = d0(d1b0+e1d0) = e2d0z

  var a3 = a1*a0*a0 + b1*a0*c0 + c1*c0*c0;
  var b3 = 2*a1*a0*b0 + b1*(a0*d0 + b0*c0) + 2*c1*c0*d0;
  var c3 = a1*b0*b0 + b1*b0*d0 + c1*d0*d0;
  //var d3 = d2*c0*z
  //var e3 = (d2*d0 + e2*c0)*z;
  //var f3 = e2*d0*z;

  //rearrange to gain the following quartic
  //5: (d2x+e2)(a4x^3+b4x^2+c4x+d) = 0
  //where
  //a4 = a2c0z
  //b4 = (a2d0+b2c0)z-a3
  //c4 = (b2d0+c2c0)z-b3
  //d4 = c2d0z-c3

  var a4 = a2*c0*z;
  var b4 = (a2*d0 + b2*c0) * z - a3;
  var c4 = (b2*d0 + c2*c0) * z - b3;
  var d4 =  c2*d0*z - c3;

  //find the roots
  var roots = solveCubic(a4,b4,c4,d4);

  var solutions = [];
  if (roots != undefined && roots.length > 0) {
    for (var i = 0; i < roots.length; ++i) {
      if (m1 !== undefined && m2 !== undefined) {
        var u2 = roots[i];
        var v2 = m2*u2 + h2;
        //var u1 = (a0*u2 + b0)/(c0*u2 + d0);
        //var v1 = m1*u1 + h1;
      }
      else if (m1 === undefined && m2 === undefined) {
        v2 = roots[i];
        u2 = k2;
        //v1 = (a0*v2 + b0)/d0;
        //u1 = k1;
      }
      else {
        v2 = roots[i];
        u2 = k2;
        //u1 = (a0*v2 + b0)/(v2 + d0);
        //v1 =  m1*u1 + h1;
      }

      //The midpoints may be the same point,
      // so cannot be used to determine the crease
      //solutions.push(this.axiom1(new M.XY((u1 + p1) / 2, (v1 + q1) / 2),
      //   new M.XY((u2 + p2) / 2, (v2 + q2) / 2)));

      if (v2 != q2) {
        //F(x) = mx + h = -((u-p)/(v-q))x +(v^2 -q^2 + u^2 - p^2)/2(v-q)
        var mF = -1*(u2 - p2)/(v2 - q2);
        var hF = (v2*v2 - q2*q2 + u2*u2 - p2*p2) / (2 * (v2 - q2));

        // solutions.push(this.axiom1(new M.XY(0, hF), new M.XY(1, mF + hF)));
        // solutions.push(Constructors.line([0, hF], [1, mF]));
        solutions.push(Constructors.line.fromPoints([0, hF], [1, mF]));
      }
      else {
        //G(y) = k
        var kG = (u2 + p2)/2;

        // solutions.push(this.axiom1(new M.XY(kG, 0), new M.XY(kG, 1)));
        // solutions.push(Constructors.line([kG, 0], [0, 1]));
        solutions.push(Constructors.line.fromPoints([kG, 0], [0, 1]));
      }
    }
  }
  // we used to return this
  // const parameters = {
  //   points: [math.vector(pointC), math.vector(pointD)],
  //   lines: [Constructors.line(pointA, vecA), Constructors.line(pointB, vecB)]
  // };
  return solutions;
};
