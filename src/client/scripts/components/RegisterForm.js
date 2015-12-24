import {connect} from 'react-redux';
import AVATARS from 'common/constants/avatars';
import {register, addErrorMessage} from 'client/actions';
import FormComponent from 'client/components/FormComponent';
import StrokedText from 'client/components/StrokedText';

class RegisterForm extends FormComponent {

    constructor(props) {
        super(props);
        this.state = {
            avatarURL: AVATARS[0].value
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        const validation = this.validate(this.state),
            hasErrors = validation.errors.length > 0;

        if (hasErrors) {
            const firstError = validation.errors[0];
            return this.props.addErrorMessage(firstError.message);
        }

        const newUser = Object.assign({}, {
            username: this.state.username,
            password: this.state.password,
            avatarURL: this.state.avatarURL,
            email: this.state.email
        });

        this.props.register(newUser);
    }

    validate(formValues) {
        const errors = [];

        if (formValues.password !== formValues.confirmPassword) {
            errors.push({
                field: 'confirmPassword',
                message: 'Passwords dont match'
            });
        }

        return {errors};
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input id="email"
                    placeholder="Email"
                    type="email"
                    required
                    onChange={this.onChange('email')}/>

                <input id="username"
                    type="text"
                    placeholder="Username"
                    required
                    onChange={this.onChange('username')}/>

                <label className="form__label form__label--avatar">
                    <img className="register-form__avatar-preview" src={this.state.avatarURL} alt="avatar"/>
                    <select id="avatar"
                        value={this.state.avatarURL}
                        onChange={this.onChange('avatarURL')}>
                        {
                            AVATARS.map(avatar => (
                                <option key={avatar.value} value={avatar.value}>{avatar.name}</option>
                            ))
                        }
                    </select>
                </label>


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

export default connect(
    null,
    {register, addErrorMessage}
)(RegisterForm);
