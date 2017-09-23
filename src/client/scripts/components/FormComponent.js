import { Component } from "react";

export default class FormComponent extends Component {
  onChange(stateProp) {
    return e => this.setState({ [stateProp]: e.target.value });
  }

  onCheckboxChange(stateProp) {
    return e => this.setState({ [stateProp]: e.target.checked });
  }
}
