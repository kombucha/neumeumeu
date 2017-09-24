import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { sortBy } from "neumeumeu-common/utils";

import { joinGame, leaveGame } from "../actions";
import Fireworks from "../components/Fireworks";
import StrokedText from "../components/StrokedText";

export default class GameResults extends PureComponent {
  componentWillMount() {
    const gameId = this.props.params.gameId;
    this.props.joinGame(gameId);
  }

  componentWillUnmount() {
    const gameId = this.props.params.gameId;
    this.props.leaveGame(gameId);
  }

  renderResults(game) {
    const rankedPlayers = sortBy("malus", game.players);
    return (
      <div className="game-results">
        <ul className="game-results__players">
          {rankedPlayers.map((p, idx) => (
            <li key={p.id} className="game-results__player">
              <span className="game-results__player__malus">
                <StrokedText text={`${p.malus}pts`} />
              </span>
              <span className="game-results__player__name">
                {idx === 0 ? <Fireworks /> : null}
                <StrokedText text={p.name} />
              </span>
            </li>
          ))}
        </ul>
        <Link className="game-results__back button" to="/">
          <StrokedText text="Back to home" />
        </Link>
      </div>
    );
  }

  render() {
    const { game } = this.props;
    return game ? this.renderResults(game) : null;
  }
}

function mapStateToProps(state) {
  return {
    game: state.gameplay,
  };
}

export const GameResultsContainer = connect(mapStateToProps, {
  joinGame,
  leaveGame,
})(GameResults);
