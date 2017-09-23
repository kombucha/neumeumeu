import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actionCreators from "client/actions";
import GameCreationForm from "client/components/GameCreationForm";

export default class GameCreation extends PureComponent {
  onCreateGame = game => {
    this.props.createGame(game);
    // TODO: redirect on successful game creation somehow
  };

  render() {
    return (
      <div className="center-col">
        <div className="center-col__inner">
          <div className="game-creation">
            <GameCreationForm onCreateGame={this.onCreateGame} />
          </div>
        </div>
      </div>
    );
  }
}

export const GameCreationContainer = connect(() => ({}), actionCreators)(
  GameCreation
);
