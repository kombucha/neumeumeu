import React from "react";
import StrokedText from "client/components/StrokedText";

export default ({ malus }) => (
  <div className="malus">
    <StrokedText text={malus} double={true} />
  </div>
);
