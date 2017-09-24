import React from "react";
import { Link } from "react-router-dom";
import { ENABLE_TIMEOUT } from "neumeumeu-common/constants/gameplay";

import FormComponent from "./FormComponent";
import StrokedText from "./StrokedText";

export default class GameCreationForm extends FormComponent {
  state = {
    enableUserActionTimeout: ENABLE_TIMEOUT,
    maxMalus: 66,
    maxPlayers: 10,
    botsCount: 0,
  };

  handleSubmit = event => {
    event.preventDefault();
    const game = Object.assign({}, this.state);
    this.props.onCreateGame(game);
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextState.botsCount > nextState.maxPlayers - 1) {
      this.setState({ botsCount: nextState.maxPlayers - 1 });
    }
  }

  render() {
    const {
      name,
      enableUserActionTimeout,
      maxMalus,
      botsCount,
      maxPlayers,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <p className="form__text">New game</p>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={this.onChange("name")}
          required
        />

        <label className="form__label">
          <span className="form__text">User Timeout ?</span>
          <span className="form__checkbox">
            <input
              type="checkbox"
              checked={enableUserActionTimeout}
              onChange={this.onCheckboxChange("enableUserActionTimeout")}
            />
            <span className="form__checkbox__placeholder" />
          </span>
        </label>

        <label className="form__label">
          <span className="form__text">Max Players</span>
          <div className="form__range">
            <span className="form__range__value">{maxPlayers}</span>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={maxPlayers}
              onChange={this.onChange("maxPlayers")}
            />
          </div>
        </label>

        <label className="form__label">
          <span className="form__text">Bots number</span>
          <div className="form__range">
            <span className="form__range__value">{botsCount}</span>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              value={botsCount}
              onChange={this.onChange("botsCount")}
            />
          </div>
        </label>

        <label className="form__label">
          <span className="form__text">Max Malus</span>
          <div className="form__range">
            <span className="form__range__value">{maxMalus}</span>
            <input
              type="range"
              min="20"
              max="200"
              step="1"
              value={maxMalus}
              onChange={this.onChange("maxMalus")}
            />
          </div>
        </label>

        <div className="form__actions">
          <Link className="button" to="/">
            <StrokedText text="Cancel" />
          </Link>
          <button className="button" type="submit">
            <StrokedText text="Create" />
          </button>
        </div>
      </form>
    );
  }
}
