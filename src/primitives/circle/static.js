import { circumcircle } from "../../core/geometry";

const CircleStatic = {
  fromPoints: function () {
    return this.constructor(...arguments);
  },
  fromThreePoints: function () {
    const result = circumcircle(...arguments);
    return this.constructor(result.radius, ...result.origin);
  }
};

export default CircleStatic;
