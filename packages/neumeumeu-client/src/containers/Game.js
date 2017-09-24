import React, { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "recompose";
import GameStatus from "neumeumeu-common/constants/game-status";
import PlayerStatus from "neumeumeu-common/constants/player-status";
import GameplayConstants from "neumeumeu-common/constants/gameplay";

import actionCreators from "../actions";
import { Animate } from "../helpers/animate";
import Players from "../components/Players";
import CardsInPlay from "../components/CardsInPlay";
import PlayerHud from "../components/PlayerHUD";
import StrokedText from "../components/StrokedText";
import ChoosePile from "../components/ChoosePile";
import ChatBox from "../components/ChatBox";
import Timer from "../components/Timer";

export class Game extends PureComponent {
  componentWillMount() {
    const gameId = this.props.params.gameId;
    this.props.joinGame(gameId);
  }

  componentDidUpdate() {
    const {
      applyResolutionStep,
      resolutionStep,
      currentPlayerIndex,
    } = this.props;
    const shouldAnimate = !!resolutionStep;

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
    const { game, resolutionStep, currentPlayer, history } = nextProps;
    if (!game) {
      return;
    }

    if (game.status === GameStatus.ENDED) {
      return history.push(`/games/${nextProps.game.id}/results`);
    } else if (
      game.status === GameStatus.SOLVED &&
      !resolutionStep &&
      currentPlayer.status !== PlayerStatus.READY_FOR_NEXT_ROUND
    ) {
      return this.getReady(game.id);
    }
  }

  startGame = () => {
    this.props.startGame(this.props.game.id);
  };

  playCard = card => {
    this.props.playCard(this.props.game.id, card.value);
  };

  autoPlayCard = () => {
    this.props.playCard(this.props.game.id, GameplayConstants.AUTO_CARD_VALUE);
  };
  autoChoosePile = () => {
    this.handlePileSelected(GameplayConstants.AUTO_PILE_VALUE);
  };

  cancelCard = () => {
    this.props.cancelCard(this.props.game.id);
  };

  sendChatMessage = messageText => {
    this.props.sendChatMessage(this.props.game.id, messageText);
  };

  getReady = gameId => {
    return this.props.playerReady(gameId);
  };

  handlePileSelected = pile => {
    if (this.props.game.status !== GameStatus.WAITING_FOR_PILE_CHOICE) {
      return;
    }

    this.props.choosePile(this.props.game.id, pile);
  };

  renderLoadingGame = () => <div>Joining game...</div>;

  renderPreGameHUD = canStartGame =>
    canStartGame ? this.renderStartGame() : <div>Waiting for players</div>;

  renderPlayerHUD = (game, player) => (
    <PlayerHud
      player={player}
      gameId={game.id}
      gameStatus={game.status}
      onHandCardClicked={this.playCard}
      onSelectedCardClicked={this.cancelCard}
    />
  );

  renderChatBox = () => (
    <div className="chat__entry__box">
      <ChatBox onSubmitMessage={this.sendChatMessage} autoFocus />
    </div>
  );

  renderTimer = currentStatus => {
    const coundownTimeout =
      currentStatus === PlayerStatus.CHOOSING_CARD
        ? GameplayConstants.CHOOSE_CARD_TIMEOUT
        : GameplayConstants.CHOOSE_PILE_TIMEOUT;

    const timeoutAction =
      currentStatus === PlayerStatus.CHOOSING_CARD
        ? this.autoPlayCard
        : this.autoChoosePile;
    const alertText =
      currentStatus === PlayerStatus.CHOOSING_CARD ? "Play your card !" : null;

    return (
      <div className="timer__container">
        <Timer
          countdown={coundownTimeout}
          onTimeout={timeoutAction}
          alertText={alertText}
        />
      </div>
    );
  };

  renderStartGame = () => (
    <button
      className="game__start button"
      type="button"
      onClick={this.startGame}>
      <StrokedText text="Start game" />
    </button>
  );

  renderGame = game => {
    const { currentPlayer, currentPlayerIndex } = this.props;
    const isOwner = game.owner === currentPlayer.id;
    const gameStarted = game.status !== GameStatus.WAITING_FOR_PLAYERS;
    const topPlayers = game.players;
    const canStartGame = !gameStarted && isOwner && game.players.length >= 2;
    const canCancelCard = game.status === GameStatus.WAITING_FOR_CARDS;

    return (
      <div className="game">
        <Players
          players={topPlayers}
          currentPlayerIndex={currentPlayerIndex}
          canCancelCard={canCancelCard}
          cancelCard={this.cancelCard}
        />

        {gameStarted ? (
          <CardsInPlay
            piles={game.cardsInPlay}
            canSelectPiles={
              currentPlayer.status === PlayerStatus.HAS_TO_CHOOSE_PILE
            }
            onPileSelected={this.handlePileSelected}
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
  };

  render() {
    const { game } = this.props;
    return game ? this.renderGame(game) : this.renderLoadingGame();
  }
}

function mapStateToProps(state) {
  const game = state.gameplay;

  const resolutionStep =
    game && game.resolutionSteps && game.resolutionSteps.length > 0
      ? game.resolutionSteps[0]
      : null;

  const currentPlayer = game
    ? game.players.find(player => player.id === state.authentication.player.id)
    : null;

  const currentPlayerIndex = game
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

export const GameContainer = compose(
  connect(mapStateToProps, actionCreators),
  withRouter
)(Game);

export default GameContainer;
