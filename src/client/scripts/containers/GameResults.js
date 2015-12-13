import {connect} from 'react-redux';
import {sort} from 'common/utils';
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

    renderResults(game) {
        const rankedPlayers = sort(game.players, (p1, p2) => p1.malus - p2.malus);
        return (
            <div className="game-results">
                <ul>
                    {
                        rankedPlayers.map((p, idx) => (
                            <li key={p.id}>{idx + 1} - {p.name} - {p.malus}pts</li>
                        ))
                    }
                </ul>
            </div>
        );
    }

    render() {
        const {game} = this.props;
        return game ? this.renderResults(game) : null;
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
