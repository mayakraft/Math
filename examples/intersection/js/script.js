Vue.component("button-mode", {
  props: ["mode"],
  template: `<div class="button-tap-mode">
    <i :class="mode" :style="'background-image: url(./images/'+mode+'.svg)'"></i>
  </div>`
});

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
    argPoints: [],
    intersections: [],
    nearestPoints: [],
    svg: undefined,
    uiLayer: undefined,
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
    },
    onRelease: function (point) {
      point = Snap(point);
      this.history.push({
        function: this.function,
        arguments: [this.pressPoint, point],
      });
      this.bigUpdate();
    },
    changeMode: function (...args) {
      this.function = args[0].target.className;
    },
    smallUpdate: function (point) {
      this.uiLayer.removeChildren();
      if (point.buttons > 0) {
        this.uiLayer.appendChild(states[this.function].svg([this.pressPoint, point]));
      }
      this.nearestPoints = NearestPoints(this.history, point);
      this.nearestPoints.forEach(p => this.uiLayer.circle(0.01).origin(p).stroke("none").fill("#fb4"));
    },
    bigUpdate: function () {
      this.drawLayer.removeChildren();

      // convert the history into svg shapes
      this.history.map(entry => states[entry.function].svg(...entry.arguments))
        .filter(el => el != null)
        .forEach(el => this.drawLayer.appendChild(el));

      // snap-points are arguments + intersections
      this.argPoints = this.history.map(h => h.arguments)
        .reduce((a, b) => a.concat(b), []);
      this.intersections = Intersections(this.history);

      // draw all the arguments and intersection points
      [this.argPoints, this.intersections].forEach((arr, i) => arr
        .forEach(p => this.drawLayer.circle(0.01).origin(p)
          .fill(["#000", "#e53"][i])
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

const NearestPoints = function (history, point) {
  return history
    .map(entry => states[entry.function].math(...entry.arguments))
    .filter(el => el != null)
    .map(p => p.nearestPoint(point));
};

const Intersections = function (history) {
  const primitives = history
    .map(entry => states[entry.function].math(...entry.arguments))
    .filter(el => el != null);

  return Array.from(Array(primitives.length))
    .map((_, i) => Array.from(Array(i))
      .map((_, j) => primitives[i].intersect(primitives[j]))
      .filter(a => a != null)
      .map(s => (s.constructor === Array && typeof s[0] !== "number" ? s : [s])))
    .map(a => a.reduce((c, d) => c.concat(d), []))
    .reduce((a, b) => a.concat(b), []);
};

SVG(1, 1, document.querySelectorAll(".canvas-container")[0], (svg) => {
//  svg.background("white");
  app.svg = svg;
  app.drawLayer = svg.g().stroke("black").fill("none").strokeWidth(0.001);
  app.uiLayer = svg.g().stroke("black").fill("none").strokeWidth(0.001);
  svg.onMove = app.onMove;
  svg.onPress = app.onPress;
  svg.onRelease = app.onRelease;
});
