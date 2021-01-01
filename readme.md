# math for origami

[![Build Status](https://travis-ci.org/robbykraft/Math.svg?branch=master)](https://travis-ci.org/robbykraft/Math)

this is the math engine for an [origami library](https://github.com/robbykraft/Origami). it has no dependencies, and it's small. it focuses on a small set of primitives, intersections with an inclusive or exclusive epsilon, and other computational geometry related things.

## usage

This library is included in [Rabbit Ear](https://github.com/robbykraft/Origami), but, it also works on its own.

The compiled library is one file. It works included in an html file or in Node. Download it or link this CDN:

```
https://robbykraft.github.io/Math/math.js
```

## examples

this [compass straightedge](https://robbykraft.github.io/Math/examples/intersection/) app basically demonstrates intersections

many examples over on the [Rabbit Ear docs](https://rabbitear.org/docs/math.html)

## developers

a brief summary of files in the `src/` directory

```
src/
  arguments/
    get
    resize
    typeof
```

- **get** will parse an argument object and extract a vector or rectangle or line... because these often have multiple representations, like vector as an array `[1, 2]` or object `{x: 1, y: 2}`
- **resize** make vectors match lengths, for example running a dot product on a 2D and 3D vectors will resize the 2D to 3D by adding a 0.
- **typeof** try to tell if an object is a certain primitive like line or rect or circle. not necessarily matching prototypes with this library's primtives but also call an object a line if it looks like a line `{ vector: [0, 1], origin: [1, 2] }`

```
src/
  core/
    algebra
    axioms
    geometry
    matrix2, matrix3
    nearest
    radial
```

- **algebra** operations on vectors
- **axioms** the 7 origami axioms
- **geometry** shape things, methods for polygons, circles, rectangles like convex-hull, circumcircle...
- **matrix** matrix methods mostly meant for affine transforms. 2D and 3D
- **nearest** many variations of getting a "nearest" point.
- **radial** clockwise and counter clockwise angle measurements, bisects, radial sorting and comparing

```
src/
  clip/
  intersections/
  overlap/
```

these are all related, the code looks really similar at times too.

- **intersections** will return points marking the place that shapes intersect.
- **overlap** answers true or false, answers the question "do these shapes touch?"
- **clip** clip a line in a polygon. convert an infinite line/ray, or longer segment into a shorter segment.

```
src/
  primitives/
    prototypes
    
    circle
    ellipse
    lines
    matrix
    polygon
    rect
    vector
```

all primitives (lines, circles, polygons)  are Javascript objects with these custom prototypes. the folder **prototypes** itself is when multiple primitives share a prototype, so they can't go in one folder over another; those prototypes are prototypes for the prototypes.

## compile

Compile the library with rollup after running `npm install`

```
rollup -c
```

## license

MIT