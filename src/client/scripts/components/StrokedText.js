import React from "react";
import classNames from "classnames/dedupe";

export default ({ text, double }) => {
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
