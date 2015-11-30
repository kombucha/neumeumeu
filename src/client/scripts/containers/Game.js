import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import * as actionCreators from 'client/actions';

import {sort} from 'common/utils';
import Players from 'client/components/Players';
import CardsInPlay from 'client/components/CardsInPlay';
import Hand from 'client/components/Hand';
import Malus from 'client/components/Malus';

export default class Game extends PureRenderComponent {
    componentWillMount() {
        const gameId = this.props.params.gameId;
        this.props.joinRoom(gameId);
        this.props.updateCurrentGame(gameId);
    }

    componentWillUnmount() {
        const gameId = this.props.params.gameId;
        this.props.leaveRoom(gameId);
    }

    renderLoadingGame() {
        return (<div>Chargement du jeu en cours...</div>);
    }

    renderGame(game) {
        const {currentPlayer} = this.props,
            handCards = sort(currentPlayer.hand, (a, b) => a.value - b.value),
            topPlayers = game.players.filter(player => player.id !== currentPlayer.id);

        return (
            <div className="game">
                <Players players={topPlayers} />
                <CardsInPlay piles={game.cardsInPlay} />
                <Hand cards={handCards}
                      onCardSelected={this.props.playCard}/>
                <Malus malus={currentPlayer.malus}/>
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
        game: state.currentGame,
        currentPlayer: state.currentGame ?
            state.currentGame.players.find(player => player.id === state.authentication.player.id)
            : null
    };
}

export const GameContainer = connect(
    mapStateToProps,
    actionCreators
)(Game);
