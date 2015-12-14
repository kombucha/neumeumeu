import {connect} from 'react-redux';
import {sort} from 'common/utils';
import PureRenderComponent from 'client/components/PureRenderComponent';
import actionCreators from 'client/actions';
import StrokedText from 'client/components/StrokedText';

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
                        rankedPlayers.map(p => (
                            <li key={p.id} className="game-result">
                                <span className="game-result__malus">
                                    <StrokedText text={p.malus + 'pts'}/>
                                </span>
                                <span className="game-result__name">
                                    <StrokedText text={p.name}/>
                                </span>
                            </li>
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
        game: state.gameplay
    };
}

export const GameResultsContainer = connect(
    mapStateToProps,
    actionCreators
)(GameResults);
