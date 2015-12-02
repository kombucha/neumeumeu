import PureRenderComponent from 'client/components/PureRenderComponent';
import {connect} from 'react-redux';
import {login, register} from 'client/actions';
import LoginForm from 'client/components/LoginForm';
import RegisterForm from 'client/components/RegisterForm';

export default class Register extends PureRenderComponent {
    render() {
        return (
            <div>
                <div className="center-col">
                    <div className="center-col__inner">
                        <LoginForm handleLogin={this.props.login}/>
                        <p className="form__text">Don't have an account ?</p>
                        <RegisterForm handleRegistration={this.props.register}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export const RegisterContainer = connect(
    mapStateToProps,
    {login, register}
)(Register);
