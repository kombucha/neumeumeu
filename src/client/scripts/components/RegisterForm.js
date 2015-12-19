import FormComponent from 'client/components/FormComponent';
import {PropTypes} from 'react';
import StrokedText from 'client/components/StrokedText';

const AVATARS = [
    {name: 'Avatar 1',  value: '/images/players/avatar-01.svg'},
    {name: 'Avatar 2',  value: '/images/players/avatar-02.svg'},
    {name: 'Avatar 3',  value: '/images/players/avatar-03.svg'},
    {name: 'Avatar 4',  value: '/images/players/avatar-04.svg'},
    {name: 'Avatar 5',  value: '/images/players/avatar-05.svg'},
    {name: 'Avatar 6',  value: '/images/players/avatar-06.svg'},
    {name: 'Avatar 7',  value: '/images/players/avatar-07.svg'},
    {name: 'Avatar 8',  value: '/images/players/avatar-08.svg'},
    {name: 'Avatar 9',  value: '/images/players/avatar-09.svg'},
    {name: 'Avatar 10', value: '/images/players/avatar-10.svg'},
    {name: 'Avatar 11', value: '/images/players/avatar-11.svg'},
    {name: 'Avatar 13', value: '/images/players/avatar-13.svg'},
    {name: 'Avatar 14', value: '/images/players/avatar-14.svg'},
    {name: 'Avatar 15', value: '/images/players/avatar-15.svg'},
    {name: 'Avatar 16', value: '/images/players/avatar-16.svg'}
];

export default class RegisterForm extends FormComponent {

    constructor(props) {
        super(props);
        this.state = {
            avatarURL: AVATARS[0].value
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const newUser = Object.assign({}, {
            username: this.state.username,
            password: this.state.password,
            avatarURL: this.state.avatarURL,
            email: this.state.email
        });
        this.props.handleRegistration(newUser);
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

                <select id="avatar"
                    value={this.state.avatarURL}
                    onChange={this.onChange('avatarURL')}>
                    {
                        AVATARS.map(avatar => (
                            <option key={avatar.value} value={avatar.value}>{avatar.name}</option>
                        ))
                    }
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
