import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import actionCreators from 'client/actions';

import GameStatus from 'common/constants/game-status';
import PlayerStatus from 'common/constants/player-status';
import Players from 'client/components/Players';
import CardsInPlay from 'client/components/CardsInPlay';
import PlayerHud from 'client/components/PlayerHUD';
import StrokedText from 'client/components/StrokedText';

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

    componentWillReceiveProps(nextProps) {
        if (nextProps.game && nextProps.game.status === GameStatus.ENDED) {
            return nextProps.updatePath(`/games/${nextProps.game.id}/results`);
        }
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
        return (<div>Loading game...</div>);
    }

    renderPreGameHUD(canStartGame) {
        return canStartGame
            ? this.renderStartGame()
            : (<div>Waiting for players</div>);
    }

    renderPlayerHUD(game, player) {
        return (
            <PlayerHud
                player={player}
                gameId={game.id}
                onHandCardClicked={this.playCard.bind(this)}
                onSelectedCardClicked={this.cancelCard.bind(this)}/>
        );
    }

    renderGameHUD(game, player) {
        return (
            <div>
                <CardsInPlay
                    piles={game.cardsInPlay}
                    canSelectPiles={player.status === PlayerStatus.HAS_TO_CHOOSE_PILE}
                    onPileSelected={this.handlePileSelected.bind(this)} />
                {this.renderPlayerHUD(game, player)}
            </div>
        )
    }

    renderStartGame() {
        return (
            <button className="game__start button" type="button" onClick={this.startGame.bind(this)}>
                <StrokedText text="Start game"/>
            </button>
        );
    }

    renderGame(game) {
        const {currentPlayer} = this.props,
            isOwner = (game.owner === currentPlayer.id),
            gameStarted = game.status !== GameStatus.WAITING_FOR_PLAYERS,
            topPlayers = game.players,
            currentPlayerIdx = game.players.findIndex(p => p.id === currentPlayer.id),
            canStartGame = !gameStarted && isOwner && game.players.length >= 2;

        return (
            <div className="game">
                <Players players={topPlayers} highlightIdx={currentPlayerIdx} />

                {
                    gameStarted
                    ? this.renderGameHUD(game, currentPlayer)
                    : this.renderPreGameHUD(canStartGame)
                }
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
