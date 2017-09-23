import { connect } from "react-redux";
import PureRenderComponent from "client/components/PureRenderComponent";
import actionCreators from "client/actions";

import GameStatus from "common/constants/game-status";
import PlayerStatus from "common/constants/player-status";
import Players from "client/components/Players";
import CardsInPlay from "client/components/CardsInPlay";
import PlayerHud from "client/components/PlayerHUD";
import StrokedText from "client/components/StrokedText";
import { findDOMNode } from "react-dom";
import { Animate } from "client/helpers/animate";
import ChoosePile from "client/components/ChoosePile";
import ChatBox from "client/components/ChatBox";
import Timer from "client/components/Timer";
import GameplayConstants from "common/constants/gameplay";

export default class Game extends PureRenderComponent {
  componentWillMount() {
    const gameId = this.props.params.gameId;
    this.props.joinGame(gameId);
  }

  componentDidUpdate() {
    const {
        applyResolutionStep,
        resolutionStep,
        currentPlayerIndex,
      } = this.props,
      shouldAnimate = !!resolutionStep;

    if (shouldAnimate) {
      return Animate(
        resolutionStep,
        findDOMNode(this),
        currentPlayerIndex
      ).then(() => applyResolutionStep(resolutionStep));
    }
  }

  componentWillUnmount() {
    const gameId = this.props.params.gameId;
    this.props.leaveGame(gameId);
  }

  componentWillReceiveProps(nextProps) {
    const { game, resolutionStep, currentPlayer, updatePath } = nextProps;
    if (!game) {
      return;
    }

    if (game.status === GameStatus.ENDED) {
      return updatePath(`/games/${nextProps.game.id}/results`);
    } else if (
      game.status === GameStatus.SOLVED &&
      !resolutionStep &&
      currentPlayer.status !== PlayerStatus.READY_FOR_NEXT_ROUND
    ) {
      return this.getReady(game.id);
    }
  }

  startGame() {
    this.props.startGame(this.props.game.id);
  }

  playCard(card) {
    this.props.playCard(this.props.game.id, card.value);
  }

  autoPlayCard() {
    this.props.playCard(this.props.game.id, GameplayConstants.AUTO_CARD_VALUE);
  }
  autoChoosePile() {
    this.handlePileSelected(GameplayConstants.AUTO_PILE_VALUE);
  }

  cancelCard() {
    this.props.cancelCard(this.props.game.id);
  }

  sendChatMessage(messageText) {
    this.props.sendChatMessage(this.props.game.id, messageText);
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
    return <div>Joining game...</div>;
  }

  renderPreGameHUD(canStartGame) {
    return canStartGame ? (
      this.renderStartGame()
    ) : (
      <div>Waiting for players</div>
    );
  }

  renderPlayerHUD(game, player) {
    return (
      <PlayerHud
        player={player}
        gameId={game.id}
        gameStatus={game.status}
        onHandCardClicked={this.playCard.bind(this)}
        onSelectedCardClicked={this.cancelCard.bind(this)}
      />
    );
  }

  renderChatBox() {
    return (
      <div className="chat__entry__box">
        <ChatBox
          onSubmitMessage={this.sendChatMessage.bind(this)}
          autoFocus={true}
        />
      </div>
    );
  }

  renderTimer(currentStatus) {
    const coundownTimeout =
        currentStatus === PlayerStatus.CHOOSING_CARD
          ? GameplayConstants.CHOOSE_CARD_TIMEOUT
          : GameplayConstants.CHOOSE_PILE_TIMEOUT,
      timeoutAction =
        currentStatus === PlayerStatus.CHOOSING_CARD
          ? this.autoPlayCard.bind(this)
          : this.autoChoosePile.bind(this),
      alertText =
        currentStatus === PlayerStatus.CHOOSING_CARD
          ? "Play your card !"
          : null;

    return (
      <div className="timer__container">
        <Timer
          countdown={coundownTimeout}
          onTimeout={timeoutAction}
          alertText={alertText}
        />
      </div>
    );
  }

  renderStartGame() {
    return (
      <button
        className="game__start button"
        type="button"
        onClick={this.startGame.bind(this)}>
        <StrokedText text="Start game" />
      </button>
    );
  }

  renderGame(game) {
    const { currentPlayer, currentPlayerIndex } = this.props,
      isOwner = game.owner === currentPlayer.id,
      gameStarted = game.status !== GameStatus.WAITING_FOR_PLAYERS,
      topPlayers = game.players,
      canStartGame = !gameStarted && isOwner && game.players.length >= 2,
      canCancelCard = game.status === GameStatus.WAITING_FOR_CARDS;

    return (
      <div className="game">
        <Players
          players={topPlayers}
          currentPlayerIndex={currentPlayerIndex}
          canCancelCard={canCancelCard}
          cancelCard={this.cancelCard.bind(this)}
        />

        {gameStarted ? (
          <CardsInPlay
            piles={game.cardsInPlay}
            canSelectPiles={
              currentPlayer.status === PlayerStatus.HAS_TO_CHOOSE_PILE
            }
            onPileSelected={this.handlePileSelected.bind(this)}
          />
        ) : null}

        {currentPlayer.status === PlayerStatus.HAS_TO_CHOOSE_PILE ? (
          <ChoosePile />
        ) : null}

        {game.players.length > 1 ? this.renderChatBox() : null}

        {game.enableUserActionTimeout &&
        (currentPlayer.status === PlayerStatus.CHOOSING_CARD ||
          currentPlayer.status === PlayerStatus.HAS_TO_CHOOSE_PILE)
          ? this.renderTimer(currentPlayer.status)
          : null}

        {gameStarted
          ? this.renderPlayerHUD(game, currentPlayer)
          : this.renderPreGameHUD(canStartGame)}
      </div>
    );
  }

  render() {
    const { game } = this.props;
    return game ? this.renderGame(game) : this.renderLoadingGame();
  }
}

function mapStateToProps(state) {
  const game = state.gameplay,
    resolutionStep =
      game && game.resolutionSteps && game.resolutionSteps.length > 0
        ? game.resolutionSteps[0]
        : null,
    currentPlayer = game
      ? game.players.find(
          player => player.id === state.authentication.player.id
        )
      : null,
    currentPlayerIndex = game
      ? game.players.findIndex(
          player => player.id === state.authentication.player.id
        )
      : null;

  return {
    game,
    resolutionStep,
    currentPlayer,
    currentPlayerIndex,
  };
}

export const GameContainer = connect(mapStateToProps, actionCreators)(Game);
