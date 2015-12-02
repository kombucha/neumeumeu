import {connect} from 'react-redux';
import {Link} from 'react-router';
import PureRenderComponent from 'client/components/PureRenderComponent';
import {login,logout} from 'client/actions';
import StrokedText from 'client/components/strokedText';

export class LoginStatus extends PureRenderComponent {

    handleLogout() {
        this.props.logout();
    }

    renderLoggedIn() {
        return (
            <div>
                <p>{this.props.player.name}</p>
                <button type="button" className="btn" onClick={() => this.handleLogout()}>
                    <StrokedText text="Log out"/>
                </button>
            </div>
        );
    }

    renderLoggedOut() {
        return (
            <Link className="btn" to="/register">
                <StrokedText text="Connect"/>
            </Link>
        );
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
        player: auth.player,
        token: auth.token
    };
}

export const LoginStatusContainer = connect(
    mapStateToProps,
    {login, logout}
)(LoginStatus);
