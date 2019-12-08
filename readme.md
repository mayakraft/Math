# math for origami

[![Build Status](https://travis-ci.org/robbykraft/Math.svg?branch=master)](https://travis-ci.org/robbykraft/Math)

this is the math engine for an [origami library](https://github.com/robbykraft/Origami). it has no dependencies, and it's small. you probably want a different math library if a search brought you here.

## why

i wrote this specifically to handle the edge cases, for example in geometric boolean operations.

turns out in origami math when asking questions like intersection or inclusion/exclusion there is a high rate of parameters that are collinear, parallel, on to top of one another, etc... i had to be very sure about the results, and be able to manage the epsilon for different scales.

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
