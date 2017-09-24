import React, { PureComponent } from "react";
import { connect } from "react-redux";
import GoogleLogin from "react-google-login";
import { login } from "../actions";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

class Login extends PureComponent {
  _handleLoginSucessful = result => {
    const { login, location } = this.props;
    const redirectTo = location.query ? location.query.redirectTo : undefined;
    login(result.code, redirectTo);
  };
  render() {
    return (
      <div className="center-col">
        <div className="center-col__inner">
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            responseType="code"
            onSuccess={this._handleLoginSucessful}
            onFailure={(...args) => console.log("error", args)}
          />
        </div>
      </div>
    );
  }
}

export default connect(null, { login })(Login);
