import FormComponent from 'client/components/FormComponent';

export default class LoginForm extends FormComponent {

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="register-form__group">
                    <label htmlFor="username">Username:</label>
                    <input id="username" type="text"
                        required
                        onChange={this.onChange('username')}/>
                </div>

                <div className="register-form__group">
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" required onChange={this.onChange('password')}/>
                </div>

                <button type="submit">Login</button>
            </form>
        );
    }
}
