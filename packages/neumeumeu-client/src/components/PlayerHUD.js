import React from "react";
import { pure } from "recompose";
import { sortBy } from "neumeumeu-common/utils";
import GameStatus from "neumeumeu-common/constants/game-status";
import Hand from "./Hand";
import Malus from "./Malus";

const PlayerHUD = ({ player, gameId, gameStatus, onHandCardClicked }) => {
  const sortedCards = sortBy("value", player.hand);
  let handClasses =
    gameStatus === GameStatus.WAITING_FOR_CARDS ? "hand--choosing-card" : null;

  return (
    <div className="player-hud">
      <div className="player-hud__main">
        <Hand
          className={handClasses}
          cards={sortedCards}
          onCardSelected={onHandCardClicked}
        />
        <Malus malus={player.malus} />
      </div>
    </div>
  );
};

export default pure(PlayerHUD);
