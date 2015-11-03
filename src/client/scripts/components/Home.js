import PureRenderComponent from './PureRenderComponent';
import {connect} from 'react-redux';
import * as actionCreators from 'client/action-creators';

export default class Home extends PureRenderComponent {

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

export const HomeContainer = connect(
    mapStateToProps,
    actionCreators
)(Home);
