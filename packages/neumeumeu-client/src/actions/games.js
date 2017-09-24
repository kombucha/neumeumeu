import api from "../api";
import history from "../history";
import { joinRoom, leaveRoom } from "./remote";
import { addErrorMessage } from "./errors";

function updateGames(games) {
  return {
    type: "UPDATE_GAMES",
    games,
  };
}

export function createGame(game) {
  return dispatch => {
    return api
      .createGame(game)
      .then(gameId => {
        history.push(`/games/${gameId}`);
      })
      .catch(err => dispatch(addErrorMessage(err)));
  };
}

export function fetchGames() {
  return dispatch => {
    return api.fetchGames().then(games => dispatch(updateGames(games)));
  };
}

export function joinLobby() {
  return dispatch => {
    return api.fetchGames().then(games => {
      dispatch(updateGames(games));
      dispatch(joinRoom("lobby"));
    });
  };
}

export function leaveLobby() {
  return leaveRoom("lobby");
}

export default {
  createGame,
  fetchGames,
  joinLobby,
  leaveLobby,
};
