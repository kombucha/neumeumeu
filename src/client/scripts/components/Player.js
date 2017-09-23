import { PropTypes } from "react";

import classNames from "classnames/dedupe";
import PlayerStatus from "common/constants/player-status";
import Card from "./Card";
import ChatMessage from "./ChatMessage";

const Player = ({
  player,
  isCurrentPlayer,
  cancelCard,
  canCancelCard,
  showMessage,
  zone,
  defaultAvatarURL = "/images/players/avatar-default.svg",
}) => {
  const avatarURL = player.avatarURL || defaultAvatarURL,
    classes = classNames("player", {
      "player--current": isCurrentPlayer,
      "player--played-card":
        player.status === PlayerStatus.PLAYED_CARD ||
        player.status === PlayerStatus.CHOOSED_PILE,
      "player--choosing-pile":
        player.status === PlayerStatus.HAS_TO_CHOOSE_PILE,
      "player--ai": !!player.AIEnabled,
    }),
    showCancelAction = isCurrentPlayer && player.chosenCard && canCancelCard;

  return (
    <div className={classes}>
      <div className="player__malus">{player.malus}</div>
      <div className="player__username">{player.name}</div>
      <img
        className="player__avatar"
        src={avatarURL}
        alt="{player.name}'s avatar"
      />

      <div className="player__card-container">
        {showCancelAction ? (
          <button className="player__cancel" onClick={() => cancelCard()} />
        ) : null}

        <div className="player__card">
          {player.chosenCard ? (
            <Card
              className="card--player"
              card={player.chosenCard}
              flippable={true}
            />
          ) : (
            <div className="player__card-placeholder" />
          )}
        </div>
      </div>
      {showMessage && player.message ? (
        <ChatMessage
          className={classNames(
            "message--player",
            zone == "right" ? "message--align-right" : "message--align-left"
          )}
          isCurrentPlayer={isCurrentPlayer}
          message={player.message}
          hideOnClick={true}
        />
      ) : null}
    </div>
  );
};

Player.propTypes = {
  player: PropTypes.object.isRequired,
  isCurrentPlayer: PropTypes.bool.isRequired,
  canCancelCard: PropTypes.bool.isRequired,
  cancelCard: PropTypes.func.isRequired,
};

export default Player;
