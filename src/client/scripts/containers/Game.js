import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import {updateCurrentGame, startGame, joinRoom, leaveRoom, playCard} from 'client/actions';

import GameStatus from 'common/constants/game-status';
import Players from 'client/components/Players';
import CardsInPlay from 'client/components/CardsInPlay';
import PlayerHud from 'client/components/PlayerHUD';

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

    startGame() {
        this.props.startGame(this.props.game.id);
    }

    playCard(card) {
        this.props.playCard(this.props.game.id, card.value);
    }

    renderLoadingGame() {
        return (<div>Chargement du jeu en cours...</div>);
    }

    renderPlayerHUD(player) {
        return (<PlayerHud player={player} onCardSelected={this.playCard.bind(this)}/>);
    }

    renderStartGame() {
        return (<button onClick={this.startGame.bind(this)}>Start Game</button>);
    }

    renderGame(game) {
        const {currentPlayer} = this.props,
            isOwner = (game.owner === currentPlayer.id),
            gameStarted = game.status !== GameStatus.WAITING_FOR_PLAYERS,
            topPlayers = game.players.filter(player => player.id !== currentPlayer.id);

        return (
            <div className="game">
                <Players players={topPlayers} />
                <CardsInPlay piles={game.cardsInPlay} />
                {gameStarted ? this.renderPlayerHUD(currentPlayer) : null}
                {!gameStarted && isOwner ? this.renderStartGame() : null}
            </div>
        );
    }

    render() {
        const {game} = this.props;
        return game ? this.renderGame(game) : this.renderLoadingGame();
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

export const GameContainer = connect(
    mapStateToProps,
    {updateCurrentGame, startGame, joinRoom, leaveRoom, playCard}
)(Game);
