import FormComponent from 'client/components/FormComponent';
import {PropTypes} from 'react';
import StrokedText from 'client/components/strokedText';

export default class LoginForm extends FormComponent {

    handleSubmit(event) {
        event.preventDefault();
        // TODO: validation
        this.props.handleLogin(this.state.username, this.state.password);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input id="username"
                    type="text"
                    placeholder="Username"
                    required
                    onChange={this.onChange('username')}/>

                <input id="password"
                    placeholder="Password"
                    type="password"
                    required
                    onChange={this.onChange('password')}/>

                <button className="button" type="submit">
                    <StrokedText text="Login"/>
                </button>
            </form>
        );
    }
}

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired
};
