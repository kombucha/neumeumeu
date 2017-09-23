import React from "react";
import Hand from "client/components/Hand";
import Malus from "client/components/Malus";
import PlayerMenu from "client/components/playerMenu";
import { sortBy } from "common/utils";
import GameStatus from "common/constants/game-status";

export default ({ player, gameId, gameStatus, onHandCardClicked }) => {
  const sortedCards = sortBy("value", player.hand);
  let handClasses =
    gameStatus === GameStatus.WAITING_FOR_CARDS ? "hand--choosing-card" : null;

  return (
    <div className="player-hud">
      <div className="player-hud__main">
        <PlayerMenu player={player} gameId={gameId} />
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
