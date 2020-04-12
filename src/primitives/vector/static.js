const VectorStatic = function (proto) {
  proto.fromAngle = function (angle) {
    return proto(Math.cos(angle), Math.sin(angle));
  };
};

export default VectorStatic;
