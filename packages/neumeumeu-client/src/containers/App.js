import React from "react";
import ErrorMessagesContainer from "./ErrorMessagesContainer";

export default props => (
  <div className="app">
    <ErrorMessagesContainer text="Error while login!" />
    {props.children}
  </div>
);
