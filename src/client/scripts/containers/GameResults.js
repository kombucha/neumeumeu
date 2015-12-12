import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import actionCreators from 'client/actions';

export default class GameResults extends PureRenderComponent {
    componentWillMount() {
        const gameId = this.props.params.gameId;
        this.props.updateCurrentGame(gameId);
    }

    componentWillUnmount() {
        this.props.clearCurrentGame();
    }

    render() {
        return (<div className="game-results">TEEHEE :)</div>);
    }
}

function mapStateToProps(state) {
    return {
        game: state.gameplay,
        currentPlayer: state.gameplay ?
            state.gameplay.players.find(player => player.id === state.authentication.player.id)
            : null
    };
}

export const GameResultsContainer = connect(
    mapStateToProps,
    actionCreators
)(GameResults);
