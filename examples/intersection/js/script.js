Vue.component("button-mode", {
  props: ["mode"],
  template: `<div class="button-tap-mode">
    <i :class="mode" :style="'background-image: url(./images/'+mode+'.svg)'"></i>
  </div>`
});

const RADIUS1 = 0.005;
const WEIGHT1 = 0.001;
const WEIGHT2 = 0.005;
// use colors from
// https://kgolid.github.io/chromotome-site/

const app = new Vue({
  el: "#app",
  data: {
    function: "bisect",
    states,
    history: [],
    // these are calculated
    pressPoint: undefined,
		pressLine: undefined,
    argPoints: [],
    intersections: [],
    nearestPoints: [],
		nearestLine: undefined, // current nearest line
    svg: undefined,
    uiTop: undefined,
		uiBottom: undefined,
    drawLayer: undefined
  },
  methods: {
    onMove: function (point) {
      // point = Snap(this.snapPoints, point);
      // we need the raw point data coming in here
      this.smallUpdate(point);
    },
    onPress: function (point) {
      point = Snap(point);
      this.pressPoint = point;
			this.pressLine = NearestLine(this.history, point);
    },
    onRelease: function (point) {
      point = Snap(point);
      this.history.push({
        function: this.function,
        points: [this.pressPoint, point],
				lines: [this.pressLine, this.nearestLine],
      });
      this.bigUpdate();
    },
    changeMode: function (...args) {
      this.function = args[0].target.className;
    },
    smallUpdate: function (point) {
      this.uiTop.removeChildren();
      this.uiBottom.removeChildren();
			this.nearestLine = NearestLine(this.history, point);
      if (point.buttons > 0) {
				// convert pritmitive to SVG
				const points = [this.pressPoint, point];
				const lines = [this.pressLine, this.nearestLine];
				const svg = states[this.function].svg(points, lines);
				// sometimes fails if points are degenerate
				if (svg) { this.uiTop.appendChild(svg); }
      }
			if (this.nearestLine) {
				const res = infinityBox.clipLine(this.nearestLine);
				if (res) {
					this.uiBottom.line(res[0], res[1])
						.strokeWidth(WEIGHT2)
						.stroke("#fb4");
				}
			}
      this.nearestPoints = NearestPoints(this.history, point);
      this.nearestPoints.forEach(p => this.uiTop
				.circle(RADIUS1)
					.origin(p)
					.stroke("none")
					.fill("#e53"));
    },
    bigUpdate: function () {
      this.drawLayer.removeChildren();

      // convert the history into svg shapes
      this.history.map(entry => states[entry.function].svg(entry.points, entry.lines))
        .filter(el => el != null)
        .forEach(el => this.drawLayer.appendChild(el));

      // snap-points are history.points + intersections
      this.argPoints = this.history.map(h => h.points)
        .reduce((a, b) => a.concat(b), []);
      this.intersections = Intersections(this.history);

      // draw all the argument points and intersection points
      [this.argPoints, this.intersections].forEach((arr, i) => arr
        .forEach(p => this.drawLayer.circle(RADIUS1).origin(p)
          .fill(["#000", "#158"][i])
          .stroke("none")));
    },
  }
});

const setPoint = (point, newX, newY) => {
  delete point.x;
  delete point.y;
  Object.defineProperty(point, "x", { get: () => newX, enumerable: true });
  Object.defineProperty(point, "y", { get: () => newY, enumerable: true });
  return point;
};

const Snap = (point) => {
  const pt = point.x != null ? [point.x, point.y] : point;
  const level1 = [].concat(app.argPoints).concat(app.intersections)
    .map(a => (a.x != null ? [a.x, a.y] : a));
  const level2 = [].concat(app.nearestPoints)
    .map(a => (a.x != null ? [a.x, a.y] : a));
  const points = level1;
  const nearest1 = math.core.nearest_point(pt, level1);
  const nearest2 = math.core.nearest_point(pt, level2);
  if (nearest1 && math.core.distance2(pt, nearest1) < 0.05) {
    return setPoint(point, nearest1[0], nearest1[1]);
  }
  if (nearest2 && math.core.distance2(pt, nearest2) < 0.05) {
    return setPoint(point, nearest2[0], nearest2[1]);
  }
  return point;
};

const NearestLine = (history, point) => {
	const lines = history
		.filter(entry => states[entry.function].isLine)
		.map(entry => states[entry.function].math(entry.points, entry.lines))
	if (!lines.length) { return undefined; }
	const nearestPointDistances = lines
		.map(line => math.core.distance2(line.nearestPoint(point), [point.x, point.y]));
	const nearestIndex = lines
		.map((_, i) => i)
		.sort((a, b) => nearestPointDistances[a] - nearestPointDistances[b])
		.shift();
	return lines[nearestIndex];
};

const NearestPoints = (history, point) => history
	.map(entry => states[entry.function].math(entry.points, entry.lines))
	.filter(el => el != null)
	.map(p => p.nearestPoint(point));

const Intersections = (history) => {
  const primitives = history
    .map(entry => states[entry.function].math(entry.points, entry.lines))
    .filter(el => el != null);

  return Array.from(Array(primitives.length))
    .map((_, i) => Array.from(Array(i))
      .map((_, j) => primitives[i].intersect(primitives[j]))
      .filter(a => a != null)
      .map(s => (s.constructor === Array && typeof s[0] !== "number" ? s : [s])))
    .map(a => a.reduce((c, d) => c.concat(d), []))
    .reduce((a, b) => a.concat(b), []);
};

SVG(document.querySelectorAll(".canvas-container")[0], (svg) => {
  svg.size(1, 1)
		.fill("none")
		.stroke("black")
		.strokeWidth(WEIGHT1);
	svg.onMove = app.onMove;
	svg.onPress = app.onPress;
	svg.onRelease = app.onRelease;
	app.svg = svg;
	app.uiBottom = svg.g();
	app.drawLayer = svg.g();
	app.uiTop = svg.g();
});

