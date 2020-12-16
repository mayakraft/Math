# math for origami

[![Build Status](https://travis-ci.org/robbykraft/Math.svg?branch=master)](https://travis-ci.org/robbykraft/Math)

this is the math engine for an [origami library](https://github.com/robbykraft/Origami). it has no dependencies, and it's small. it focuses on a small set of primitives, intersections with an inclusive or exclusive epsilon, and other computational geometry related things.

## browser

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
