import Constructors from "../constructors";

const VectorStatic = {
  fromAngle: function (angle) {
    return Constructors.vector(Math.cos(angle), Math.sin(angle));
  },
};

export default VectorStatic;
