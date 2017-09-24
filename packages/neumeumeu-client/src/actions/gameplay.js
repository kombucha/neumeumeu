import Errors from "neumeumeu-common/constants/errors";
import history from "../history";
import api from "../api";
import { joinRoom, leaveRoom } from "./remote";
import { addErrorMessage } from "./errors";

function updateCurrentGame(game) {
  return {
    type: "UPDATE_CURRENT_GAME",
    game,
  };
}

function clearCurrentGame() {
  return {
    type: "CLEAR_CURRENT_GAME",
  };
}

export function startGame(gameId) {
  return () => api.startGame(gameId);
}

export function playCard(gameId, cardValue) {
  return () => api.playCard(gameId, cardValue);
}

export function cancelCard(gameId) {
  return () => api.cancelCard(gameId);
}

export function choosePile(gameId, pile) {
  return () => api.choosePile(gameId, pile);
}

export function playerReady(gameId) {
  return () => api.playerReady(gameId);
}

export function joinGame(gameId) {
  return dispatch => {
    return api
      .joinGame(gameId)
      .then(game => {
        dispatch(updateCurrentGame(game));
        dispatch(joinRoom(gameId));
      })
      .catch(error => {
        if (error === Errors.INVALID_TOKEN) {
          return history.push("/login");
        }

        dispatch(addErrorMessage(error));
      });
  };
}

export function leaveGame(gameId) {
  return dispatch => {
    dispatch(leaveRoom(gameId));
    dispatch(clearCurrentGame());
  };
}

export function applyResolutionStep(step) {
  return {
    type: "APPLY_RESOLUTION_STEP",
    step,
  };
}

export function sendChatMessage(gameId, messageText) {
  return () => api.sendChatMessage(gameId, messageText);
}

export default {
  joinGame,
  leaveGame,
  playerReady,
  applyResolutionStep,

  startGame,
  playCard,
  cancelCard,
  choosePile,
  sendChatMessage,
};
