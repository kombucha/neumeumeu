import {connect} from 'react-redux';
import {Link} from 'react-router';
import PureRenderComponent from 'client/components/PureRenderComponent';
import GameList from 'client/components/GameList';
import * as actionCreators from 'client/actions';

export default class Home extends PureRenderComponent {

    componentWillMount() {
        this.props.fetchGames();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.register(this.refs.username.value);
    }

    render() {
        return (
            <div className="home">
                <Link to="/games/create">Create Game</Link>
                <GameList games={this.props.games}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        games: state.games || []
    };
}

export const HomeContainer = connect(
    mapStateToProps,
    actionCreators
)(Home);
