import React from "react";
import { pure } from "recompose";
import classNames from "classnames/dedupe";

const StrokedText = ({ text, double }) => {
  const classes = classNames("stroked-text", {
    "stroked-text--double": double,
  });

  return (
    <span className={classes}>
      <span className="stroked-text__stroke">{text}</span>
      <span className="stroked-text__fill">{text}</span>
    </span>
  );
};

export default pure(StrokedText);
