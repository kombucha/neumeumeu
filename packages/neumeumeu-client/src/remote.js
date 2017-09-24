import io from "socket.io-client";
import api from "./api";
import { updateRemoteStatus, joinRoom } from "./actions";

export function bindSocketToStore(socket, store) {
  socket.on("connect", () => {
    const state = store.getState();
    const currentPlayer = state.authentication.player;
    const rooms = state.remote.rooms;

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

export function configureSocket() {
  if (process.env.REACT_APP_USE_MOCKS) {
    return { on: () => null };
  }

  const { location } = window;
  const portSuffix = location.port ? `:${location.port}` : "";

  return io(`${location.protocol}//${location.hostname}${portSuffix}`);
}

export default {
  configureSocket,
  bindSocketToStore,
};
