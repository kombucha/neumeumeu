import Server from "socket.io";
import r from "server/database";
import log from "server/log";

let io;

function start(server, config) {
  io = Server(server, config);
  return flushSockets();
}

function on(...args) {
  return io.on.apply(io, args);
}

function emitAction(socketId, action) {
  io.sockets.connected[socketId].emit("action", action);
}

function getRoomSocketsIds(roomId) {
  return Object.keys(io.sockets.connected).filter(socketId => {
    return io.sockets.connected[socketId].rooms.indexOf(roomId) !== -1;
  });
}

function broadcastActionToRoom(roomId, action) {
  io.sockets.to(roomId).emit("action", action);
}

function joinRoom(socket, roomId) {
  socket.join(roomId);
  return Promise.resolve(roomId);
}

function leaveRoom(socket, roomId) {
  socket.leave(roomId);
  return Promise.resolve(roomId);
}

function getPlayerFromSocket(socketId) {
  return r
    .table("player")
    .filter(player => player("sockets").contains(socketId))
    .run()
    .then(players => players[0]);
}

function associatePlayerWithSocket(playerId, socketId) {
  return r
    .table("player")
    .get(playerId)
    .update({
      sockets: r
        .row("sockets")
        .default([])
        .setInsert(socketId),
    })
    .run();
}

function dissociatePlayerFromSocket(socketId) {
  return r
    .table("player")
    .update({
      sockets: r
        .row("sockets")
        .default([])
        .setDifference([socketId]),
    })
    .run();
}

function flushSockets() {
  log.info("Flushing sockets");
  return r
    .table("player")
    .update({ sockets: [] })
    .run();
}

export default {
  start,

  on,
  joinRoom,
  leaveRoom,

  getRoomSocketsIds,
  emitAction,
  broadcastActionToRoom,

  getPlayerFromSocket,
  associatePlayerWithSocket,
  dissociatePlayerFromSocket,
};
