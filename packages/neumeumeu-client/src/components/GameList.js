import React from "react";
import { pure } from "recompose";
import GameItem from "./GameItem";

const GameList = ({ games, onSelectGame }) => (
  <ul className="game-list">
    {games.length === 0 ? (
      <li>No game in progress :(</li>
    ) : (
      games.map(game => (
        <li className="game-list__item" key={game.id}>
          <GameItem game={game} onClick={onSelectGame} />
        </li>
      ))
    )}
  </ul>
);

export default pure(GameList);
