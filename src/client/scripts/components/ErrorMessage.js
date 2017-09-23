import React from "react";
import classNames from "classnames/dedupe";

export default ({ text }) => {
  const classes = classNames("messages", { "messages--show": !!text });

  return (
    <div className={classes}>
      <span className="messages__text">{String(text)}</span>
    </div>
  );
};
