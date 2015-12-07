import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import actionCreators from 'client/actions';

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
        this.props.clearCurrentGame();
    }

    startGame() {
        this.props.startGame(this.props.game.id);
    }

    playCard(card) {
        this.props.playCard(this.props.game.id, card.value);
    }

    cancelCard() {
        this.props.cancelCard(this.props.game.id);
    }

    handlePileSelected(pile) {
        if (this.props.game.status !== GameStatus.WAITING_FOR_PILE_CHOICE) {
            return;
        }

        this.props.choosePile(this.props.game.id, pile);
    }

    renderLoadingGame() {
        return (<div>Chargement du jeu en cours...</div>);
    }

    renderPlayerHUD(player) {
        return (
            <PlayerHud player={player}
                onHandCardClicked={this.playCard.bind(this)}
                onSelectedCardClicked={this.cancelCard.bind(this)}/>
        );
    }

    renderStartGame() {
        return (<button onClick={this.startGame.bind(this)}>Start Game</button>);
    }

    renderGame(game) {
        const {currentPlayer} = this.props,
            isOwner = (game.owner === currentPlayer.id),
            gameStarted = game.status !== GameStatus.WAITING_FOR_PLAYERS,
            topPlayers = game.players.filter(player => player.id !== currentPlayer.id),
            canStartGame = !gameStarted && isOwner && game.players.length >= 2;

        return (
            <div className="game">
                <Players players={topPlayers} />
                <CardsInPlay piles={game.cardsInPlay} onPileSelected={this.handlePileSelected.bind(this)} />
                {gameStarted ? this.renderPlayerHUD(currentPlayer) : null}
                {canStartGame ? this.renderStartGame() : null}
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
    actionCreators
)(Game);
