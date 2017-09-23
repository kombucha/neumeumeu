import { connect } from "react-redux";
import { login } from "client/actions";
import FormComponent from "client/components/FormComponent";
import StrokedText from "client/components/StrokedText";

class LoginForm extends FormComponent {
  handleSubmit(event) {
    event.preventDefault();

    const { redirectTo } = this.props;

    // TODO: validation

    this.props.login(this.state.username, this.state.password, redirectTo);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input
          id="username"
          type="text"
          placeholder="Username"
          required
          onChange={this.onChange("username")}
        />

        <input
          id="password"
          placeholder="Password"
          type="password"
          required
          onChange={this.onChange("password")}
        />

        <button className="button" type="submit">
          <StrokedText text="Login" />
        </button>
      </form>
    );
  }
}

export default connect(null, { login })(LoginForm);
