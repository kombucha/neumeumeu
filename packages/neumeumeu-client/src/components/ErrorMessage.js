import React from "react";
import { pure } from "recompose";
import classNames from "classnames/dedupe";

const ErrorMessage = ({ text }) => {
  const classes = classNames("messages", { "messages--show": !!text });

  return (
    <div className={classes}>
      <span className="messages__text">{String(text)}</span>
    </div>
  );
};

export default pure(ErrorMessage);
