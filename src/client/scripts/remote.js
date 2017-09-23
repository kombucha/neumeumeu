import io from "socket.io-client";
import api from "client/api";
import { updateRemoteStatus, joinRoom } from "client/actions";

function bindSocketToStore(socket, store) {
  socket.on("connect", () => {
    const state = store.getState(),
      currentPlayer = state.authentication.player,
      rooms = state.remote.rooms;

    // Set remote connected
    store.dispatch(updateRemoteStatus(true));
    // Reconnect to rooms
    rooms.forEach(room => store.dispatch(joinRoom(room)));

    // If loggedin, request socket / player association
    if (currentPlayer) {
      api.associateSocketToPlayer(currentPlayer.id, socket.id);
    }
  });

  socket.on("disconnect", () => store.dispatch(updateRemoteStatus(false)));
  socket.on("action", action => store.dispatch(action));
}

function configureSocket() {
  if (__USE_MOCKS__) {
    return { on: () => null };
  }

  const portSuffix = location.port ? `:${location.port}` : "";

  return io(`${location.protocol}//${location.hostname}${portSuffix}`);
}

export default {
  configureSocket,
  bindSocketToStore,
};
