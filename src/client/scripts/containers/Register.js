import React, { PureComponent } from "react";
import LoginForm from "client/components/LoginForm";
import RegisterForm from "client/components/RegisterForm";

export default class Register extends PureComponent {
  render() {
    const { query } = this.props.location;
    const redirectTo = query ? query.redirectTo : undefined;

    return (
      <div>
        <div className="center-col">
          <div className="center-col__inner">
            <LoginForm redirectTo={redirectTo} />
            <p className="form__text">Don't have an account ?</p>
            <RegisterForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    );
  }
}
