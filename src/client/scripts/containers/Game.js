import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import actionCreators from 'client/actions';

import GameStatus from 'common/constants/game-status';
import PlayerStatus from 'common/constants/player-status';
import Players from 'client/components/Players';
import CardsInPlay from 'client/components/CardsInPlay';
import PlayerHud from 'client/components/PlayerHUD';
import StrokedText from 'client/components/StrokedText';
import {findDOMNode} from 'react-dom';
import Animate from 'client/helpers/animate';

export default class Game extends PureRenderComponent {
    componentWillMount() {
        const gameId = this.props.params.gameId;

        this.props.joinRoom(gameId);
        this.props.updateCurrentGame(gameId);
    }

    componentDidUpdate() {
        const {applyResolutionStep, resolutionStep, game, currentPlayerIndex} = this.props,
            shouldAnimate = !!resolutionStep,
            shouldGetReady = !!game
                && game.status === GameStatus.SOLVED
                && !resolutionStep ;

        if (shouldAnimate) {
            return Animate(resolutionStep, findDOMNode(this), currentPlayerIndex)
                .then(() => applyResolutionStep(resolutionStep));
        } else if (shouldGetReady) {
            this.getReady(game.id);
        }
    }

    componentWillUnmount() {
        const gameId = this.props.params.gameId;
        this.props.leaveRoom(gameId);
        this.props.clearCurrentGame();
    }

    componentWillReceiveProps(nextProps) {
        const {game, resolutionStep, currentPlayer, updatePath} = nextProps;
        if (!game) {
            return;
        }

        if (game.status === GameStatus.ENDED) {
            return updatePath(`/games/${nextProps.game.id}/results`);
        } else if (game.status === GameStatus.SOLVED
            && !resolutionStep
            && currentPlayer.status !== PlayerStatus.READY_FOR_NEXT_ROUND) {
            return this.getReady(game.id);
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

    getReady(gameId) {
        return this.props.playerReady(gameId);
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
                gameStatus={game.status}
                onHandCardClicked={this.playCard.bind(this)}
                onSelectedCardClicked={this.cancelCard.bind(this)}/>
        );
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

                { gameStarted
                    ? <CardsInPlay
                        piles={game.cardsInPlay}
                        canSelectPiles={currentPlayer.status === PlayerStatus.HAS_TO_CHOOSE_PILE}
                        onPileSelected={this.handlePileSelected.bind(this)} />
                    : null
                }

                {
                    gameStarted
                    ? this.renderPlayerHUD(game, currentPlayer)
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
    const game = state.gameplay,
        resolutionStep = game && game.resolutionSteps && game.resolutionSteps.length > 0
            ? game.resolutionSteps[0]
            : null,
        currentPlayer = game ?
            state.gameplay.players.find(player => player.id === state.authentication.player.id)
            : null,
        currentPlayerIndex = game ?
            state.gameplay.players.findIndex(player => player.id === state.authentication.player.id)
            : null;

    return {
        game,
        resolutionStep,
        currentPlayer,
        currentPlayerIndex
    };
}

export const GameContainer = connect(
    mapStateToProps,
    actionCreators
)(Game);
