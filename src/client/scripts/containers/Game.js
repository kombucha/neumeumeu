import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import * as actionCreators from 'client/actions';

import Players from 'client/components/Players';
import CardsInPlay from 'client/components/CardsInPlay';
import Hand from 'client/components/Hand';

export default class Game extends PureRenderComponent {
    componentWillMount() {
        const gameId = parseInt(this.props.params.gameId, 10);
        this.props.fetchCurrentGame(gameId);
    }

    renderLoadingGame() {
        return (<div>Chargement du jeu en cours...</div>);
    }

    renderGame(game) {
        return (
            <div className="game">
                <Players players={game.players} />
                <CardsInPlay piles={game.cardsInPlay} />
                <Hand cards={game.currentHand}
                      onCardSelected={this.props.playCard}/>
            </div>
        );
    }

    render() {
        const {game} = this.props;

        if (!game) {
            return this.renderLoadingGame();
        }

        return this.renderGame(game);
    }
}

function mapStateToProps(state) {
    return {
        game: state.currentGame
    };
}

export const GameContainer = connect(
    mapStateToProps,
    actionCreators
)(Game);
