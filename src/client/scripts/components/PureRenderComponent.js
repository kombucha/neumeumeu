import React from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class PureRender extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
}
