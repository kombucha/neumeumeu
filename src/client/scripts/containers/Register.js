import PureRenderComponent from 'client/components/PureRenderComponent';
import {connect} from 'react-redux';
import {register, logout} from 'client/actions';
import LoginForm from 'client/components/LoginForm';
import RegisterForm from 'client/components/RegisterForm';

export default class Register extends PureRenderComponent {
    render() {
        return (
            <div>
                <LoginForm/>
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
    {register, logout}
)(Register);
