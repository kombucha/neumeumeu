import React from "react";
import { pure } from "recompose";

const GameItem = ({ game, onClick }) => {
  return (
    <button className="game-item" onClick={() => onClick(game)}>
      <span className="game-item__name">{game.name}</span>
      <span className="game-item__players">
        {game.players.length} / {game.maxPlayers}
      </span>
    </button>
  );
};

export default pure(GameItem);
