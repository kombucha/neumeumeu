import React, { Component } from "react";
import classNames from "classnames/dedupe";
import { shake } from "../helpers/animate";

export default class ChatMessage extends Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    // reset the timer if children are changed
    if (
      nextProps.message.text !== this.props.message.text ||
      nextProps.message.date !== this.props.message.date
    ) {
      this.setTimer();
      this.setState({
        hidden: false,
      });

      if (
        !this.state.hidden &&
        this.props.message.notificationEffect &&
        !this.props.isCurrentPlayer
      ) {
        shake(this.refs.messageDiv);
      }
    }
  }

  componentDidMount() {
    if (this.props.message.notificationEffect && !this.props.isCurrentPlayer) {
      //Animation for the first message
      shake(this.refs.messageDiv).then(() => this.setTimer());
    } else {
      this.setTimer();
    }
  }
  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  hide = () => {
    clearTimeout(this._timer);
    this.setState({
      hidden: true,
    });
  };

  setTimer = () => {
    // clear any existing timer
    if (this._timer) {
      clearTimeout(this._timer);
    }

    // hide after `delay` milliseconds
    this._timer = setTimeout(() => {
      this.setState({
        hidden: true,
      });
      this._timer = null;
    }, this.props.message.expire);
  };

  render() {
    const classes = classNames(
      "chat__message",
      this.props.className,
      this.state.hidden ? "message-hidden" : "message-shown"
    );

    return (
      <div
        ref="messageDiv"
        className={classes}
        onClick={this.props.hideOnClick ? this.hide : null}>
        <div className="chat__message__arrow" />
        <span className="chat__message__contents">
          {this.props.message.text}
        </span>
      </div>
    );
  }
}
