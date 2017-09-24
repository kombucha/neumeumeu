import React from "react";
import { pure } from "recompose";
import StrokedText from "./StrokedText";

const Malus = ({ malus }) => (
  <div className="malus">
    <StrokedText text={malus} double={true} />
  </div>
);

export default pure(Malus);
