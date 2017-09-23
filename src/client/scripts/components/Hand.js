import React from "react";
import classNames from "classnames/dedupe";
import Card from "./Card";

export default ({ cards, className, onCardSelected }) => {
  const classes = classNames("hand", className);

  return (
    <div className={classes}>
      <ul className="hand__cards">
        {cards.map(card => (
          <li className="hand__item" key={card.value} onClick={() => onCardSelected(card)}>
            <Card className="card--hand" card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
};
