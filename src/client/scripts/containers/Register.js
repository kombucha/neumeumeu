import PureRenderComponent from 'client/components/PureRenderComponent';
import {connect} from 'react-redux';
import * as actionCreators from 'client/actions';

export default class Register extends PureRenderComponent {

    componentWillMount() {
        this.props.fetchGames();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.register(this.refs.username.value);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <label>Username:</label>
                    <input type="text" ref="username"/>
                    <button type="submit">Register</button>
                </form>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export const RegisterContainer = connect(
    mapStateToProps,
    actionCreators
)(Register);
