import { copyArray, sum } from "common/utils";

function updateCurrentGame(state, game) {
  return game;
}

function applyResolutionStep(game, step) {
  if (!game.resolutionSteps || step !== game.resolutionSteps[0]) {
    throw new Error("Invalid step resolution, you're doing it wrong", step);
  }

  const newSteps = copyArray(game.resolutionSteps);
  const players = copyArray(game.players);
  const cardsInPlay = copyArray(game.cardsInPlay);

  const gameAtNextStep = {
    players,
    cardsInPlay,
    resolutionSteps: newSteps,
  };

  let newPlayer;
  let playerIdx;
  newSteps.shift();

  // Apply step
  if (step.hasOwnProperty("fromPlayer")) {
    // From player to pile
    playerIdx = step.fromPlayer;

    cardsInPlay[step.toPile] = cardsInPlay[step.toPile].concat(
      players[playerIdx].chosenCard
    );
    newPlayer = Object.assign({}, players[playerIdx], {
      chosenCard: null,
    });
  } else {
    // From pile to player
    const newMalus = sum("malus", cardsInPlay[step.fromPile]);
    playerIdx = step.toPlayer;

    cardsInPlay[step.fromPile] = [];
    newPlayer = Object.assign({}, players[playerIdx], {
      chosenPile: null,
      malus: players[playerIdx].malus + newMalus,
    });
  }

  players.splice(playerIdx, 1, newPlayer);

  return Object.assign({}, game, gameAtNextStep);
}

export default function games(state = null, action) {
  switch (action.type) {
    case "UPDATE_CURRENT_GAME":
      return updateCurrentGame(state, action.game);
    case "APPLY_RESOLUTION_STEP":
      return applyResolutionStep(state, action.step);
    case "CLEAR_CURRENT_GAME":
      return null;
    default:
      return state;
  }
}
