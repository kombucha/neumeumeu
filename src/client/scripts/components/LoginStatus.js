import {connect} from 'react-redux';
import {Link} from 'react-router';
import PureRenderComponent from 'client/components/PureRenderComponent';
import {login,logout} from 'client/actions';

export class LoginStatus extends PureRenderComponent {

    handleLogout() {
        this.props.logout();
    }

    renderLoggedIn() {
        return (
            <span>
                <span>{this.props.user.name}</span>
                <a href="#" onClick={() => this.handleLogout()}>Log out</a>
            </span>
        );
    }

    renderLoggedOut() {
        return (<Link to="/register">Connect</Link>);
    }

    render() {
        const loggedIn = !!this.props.token;

        return (
            <div className="login-status">
                {loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const auth = state.authentication;
    return {
        user: auth.user,
        token: auth.token
    };
}

export const LoginStatusContainer = connect(
    mapStateToProps,
    {login, logout}
)(LoginStatus);
