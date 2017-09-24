const r = require("../database");

function getPlayer(playerId) {
  return r
    .table("player")
    .get(playerId)
    .run();
}

module.exports = { getPlayer };
