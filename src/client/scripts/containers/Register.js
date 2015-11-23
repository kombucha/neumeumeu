import PureRenderComponent from 'client/components/PureRenderComponent';
import {connect} from 'react-redux';
import {login, logout} from 'client/actions';
import LoginForm from 'client/components/LoginForm';
import RegisterForm from 'client/components/RegisterForm';

export default class Register extends PureRenderComponent {
    render() {
        return (
            <div>
                <LoginForm handleLogin={this.props.login}/>
                <div>Don't have an account ?</div>
                <RegisterForm/>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export const RegisterContainer = connect(
    mapStateToProps,
    {login, logout}
)(Register);
