import React from "react";
import { pure } from "recompose";
import classNames from "classnames/dedupe";
import Card from "./Card";

const CardPile = ({ cards, className, onClick }) => {
  const classes = classNames("card-pile", className);

  return (
    <ul className={classes} onClick={onClick}>
      {cards.map(card => (
        <li className="card-pile__item" key={card.value}>
          <Card className="card--pile" card={card} />
        </li>
      ))}
    </ul>
  );
};

export default pure(CardPile);
