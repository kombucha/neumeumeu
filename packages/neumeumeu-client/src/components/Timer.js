import React, { Component } from "react";
import classNames from "classnames/dedupe";

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      countdown: props.countdown || 0,
    };
  }

  componentDidMount() {
    let timer = setInterval(this.tick, 1000);
    this.setState({ timer });
  }

  componentWillUnmount() {
    if (this.state.timer) {
      this.stopCountDown();
    }
  }

  tick = () => {
    this.setState({
      countdown: this.state.countdown - 1,
    });
    if (this.state.countdown === 0) {
      if (this.props.onTimeout) {
        this.props.onTimeout();
      }
      this.stopCountDown();
    }
  };

  stopCountDown = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: null });
  };

  render() {
    let alertClass = "";
    if (this.state.countdown > 0) {
      if (this.state.countdown < this.props.countdown * 0.33) {
        alertClass = "alert-red";
      } else if (this.state.countdown < this.props.countdown * 0.66) {
        alertClass = "alert-yellow";
      } else {
        alertClass = "alert-green";
      }
    }
    const classes = classNames("timer__clock", alertClass);

    return (
      <div className={classes}>
        <div className="timer__countdown">{this.state.countdown}</div>
        <div className="l-half" />
        <div className="r-half" />
        {this.props.alertText ? (
          <span className="timer__alert">{this.props.alertText}</span>
        ) : null}
      </div>
    );
  }
}
