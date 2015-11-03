import PureRenderComponent from './PureRenderComponent';
import {connect} from 'react-redux';
import * as actionCreators from 'client/action-creators';

export default class Home extends PureRenderComponent{
    render() {
        return <div>Hello world!</div>;
    }
}

function mapStateToProps() {
    return {};
}

export const HomeContainer = connect(
    mapStateToProps,
    actionCreators
)(Home);
