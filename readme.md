# math for origami

[![Build Status](https://travis-ci.org/robbykraft/Math.svg?branch=master)](https://travis-ci.org/robbykraft/Math)

this is the math engine for an [origami library](https://github.com/robbykraft/Origami). it has no dependencies. it's small. you probably want a different library if you're just browsing and ended up here.

## mostly the reason

i wrote this is because origami math often deals with edge cases like asking the intersection when a line is parallel and on top of a polygon's side while managing the epsilon.

## html

``` html
<script src="math.js"></script>
```

## node

``` js
require("math");
```

this isn't published on npm yet. its name will change.

## dev

Build the source yourself: `rollup -c`

this is a **umd** module. you can build an **es** module if you want, change the setting in `rollup.config.js`.
