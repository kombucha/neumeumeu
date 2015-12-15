import {connect} from 'react-redux';
import {sort} from 'common/utils';
import PureRenderComponent from 'client/components/PureRenderComponent';
import Fireworks from 'client/components/Fireworks';
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
                <ul className="game-results__players">
                    {
                        rankedPlayers.map((p, idx) => (
                            <li key={p.id} className="game-results__player">
                                <span className="game-results__player__malus">
                                    <StrokedText text={p.malus + 'pts'}/>
                                </span>
                                <span className="game-results__player__name">
                                    {idx === 0 ? <Fireworks/> : null}
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
