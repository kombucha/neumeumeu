import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { login, logout } from "../actions";
import StrokedText from "./StrokedText";

export class LoginStatus extends PureComponent {
  handleLogout() {
    this.props.logout();
  }

  renderLoggedIn() {
    return (
      <div>
        <p>{this.props.player.name}</p>
        <button
          type="button"
          className="button"
          onClick={() => this.handleLogout()}>
          <StrokedText text="Log out" />
        </button>
      </div>
    );
  }

  renderLoggedOut() {
    return (
      <Link className="button" to="/register">
        <StrokedText text="Connect" />
      </Link>
    );
  }

  render() {
    const loggedIn = !!this.props.token;

    return (
      <div className="login-status">
        {loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const auth = state.authentication;
  return {
    player: auth.player,
    token: auth.token,
  };
}

export const LoginStatusContainer = connect(mapStateToProps, { login, logout })(
  LoginStatus
);
