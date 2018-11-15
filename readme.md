# computational geometry for origami

this is built to be the math engine for an origami library, but a lot of this is generally useful linear algebra and geometry.

## usage

include `geometry.js`

```
<!DOCTYPE html>
<title></title>
<script src="geometry.js"></script>
```

I sometimes have this built in either **umd** or **es** modules. **umd** is more reliable for the above case. this is specified in `rollup.config.js`.

Build a module yourself: `rollup -c`

### src

* public.js: entry point with basic types and objects which are built to type-check user input in the constructors to try to be as generous and infer as best as possible what the user intended.
* input.js: the function argument type-checking operations used in public.js

everything else is a little more more low-level

* core.js: algebra and geometry functions built to operate as fast as reasonably possible where things like vector lengths are hard coded, like cross2() for 2D vectors
* intersections.js: anything having to do with vectors crossing other vectors or polygon clipping, etc.
