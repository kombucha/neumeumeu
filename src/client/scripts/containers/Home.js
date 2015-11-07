import PureRenderComponent from 'client/components/PureRenderComponent';
import {List} from 'immutable';
import GameList from 'client/components/GameList';
import {connect} from 'react-redux';
import * as actionCreators from 'client/actions';

export default class Home extends PureRenderComponent {

    componentWillMount() {
        this.props.fetchGames();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.register(this.refs.username.value);
    }

    selectGame(game) {
        console.log(game.toJS());
        // TODO: set current game, redirect to game page
    }

    render() {
        return (
            <div>
                <GameList games={this.props.games}
                          onGameItemSelected={this.selectGame.bind(this)}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        games: state.get('games') || List()
    };
}

export const HomeContainer = connect(
    mapStateToProps,
    actionCreators
)(Home);
