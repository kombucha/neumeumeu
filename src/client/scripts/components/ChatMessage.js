import classNames from "classnames/dedupe";
import { shake } from "client/helpers/animate";
import { Component } from "react";

export default class ChatMessage extends Component {
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
        !this.isHidden() &&
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
  hide() {
    clearTimeout(this._timer);
    this.setState({
      hidden: true,
    });
  }
  isHidden() {
    return this.state && this.state.hidden;
  }
  setTimer() {
    // clear any existing timer
    this._timer != null ? clearTimeout(this._timer) : null;

    // hide after `delay` milliseconds
    this._timer = setTimeout(
      function() {
        this.setState({
          hidden: true,
        });
        this._timer = null;
      }.bind(this),
      this.props.message.expire
    );
  }
  render() {
    const classes = classNames(
      "chat__message",
      this.props.className,
      this.isHidden() ? "message-hidden" : "message-shown"
    );

    return (
      <div
        ref="messageDiv"
        className={classes}
        onClick={this.props.hideOnClick ? this.hide.bind(this) : null}>
        <div className="chat__message__arrow" />
        <span className="chat__message__contents">
          {this.props.message.text}
        </span>
      </div>
    );
  }
}
