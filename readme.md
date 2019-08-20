# math for origami

[![Build Status](https://travis-ci.org/robbykraft/Math.svg?branch=master)](https://travis-ci.org/robbykraft/Math)

this is the math engine for an [origami library](https://github.com/robbykraft/Origami). it has no dependencies, and it's small. you probably want a different math library if a search brought you here.

## the reason

i wrote this, instead of using another library, because origami math mostly deals with edge cases, like asking the intersection when two lines are parallel, or on top of a polygon's edge. or asking the intersection when an segment's endpoint lies collinear along a line, and should it be inclusive or exclusive. all the time managing a flexible epsilon.

## html

``` html
<script src="math.js"></script>
```

## node

run it locally. it's not on npm

``` js
require("math");
```

## dev

Build the source yourself: `rollup -c`

this is a **umd** module. you can build an **es** module if you want, change the setting in `rollup.config.js`.
