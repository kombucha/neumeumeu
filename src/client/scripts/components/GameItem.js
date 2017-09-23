import React from "react";

export default ({ game, onClick }) => {
  return (
    <button className="game-item" onClick={() => onClick(game)}>
      <span className="game-item__name">{game.name}</span>
      <span className="game-item__players">
        {game.players.length} / {game.maxPlayers}
      </span>
    </button>
  );
};
