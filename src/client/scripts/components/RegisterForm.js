import FormComponent from 'client/components/FormComponent';
import {PropTypes} from 'react';
import StrokedText from 'client/components/StrokedText';

export default class RegisterForm extends FormComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit(event) {
        event.preventDefault();
        const newUser = Object.assign({}, {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        });
        this.props.handleRegistration(newUser);
    }

    render() {
        const {email} = this.state;
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    required
                    onChange={this.onChange('email')}/>

                <input id="username"
                    type="text"
                    placeholder="Username"
                    required
                    onChange={this.onChange('username')}/>

                <select id="avatar">
                    <option value="">cat</option>
                    <option value="">cat</option>
                </select>

                <input id="password"
                    type="password"
                    placeholder="Password"
                    required
                    onChange={this.onChange('password')}/>

                <input id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    required
                    onChange={this.onChange('confirmPassword')}/>

                <button className="button" type="submit">
                    <StrokedText text="Create account"/>
                </button>
            </form>
        );
    }
}

RegisterForm.propTypes = {
    handleRegistration: PropTypes.func.isRequired
};
