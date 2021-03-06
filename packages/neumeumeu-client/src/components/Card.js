import React from "react";
import { pure } from "recompose";
import classNames from "classnames/dedupe";
import { range } from "neumeumeu-common/utils";

const Card = ({ card, className, onClick, flippable }) => {
  const isFlipped = !!card.value;

  const classes = classNames(
    "card",
    className,
    flippable ? "card--flippable" : null,
    isFlipped ? `card--malus-${card.malus}` : "card--flipped"
  );

  return (
    <div className={classes} onClick={onClick}>
      {flippable ? (
        <div className="card__backface">
          <div className="card__value card__value--center" />
        </div>
      ) : null}
      <div className="card__frontface">
        <div className="card__top">
          <div className="card__value card__value--top">{card.value}</div>
          <div className="card__malus">
            {range(card.malus).map((val, idx) => <span key={idx} />)}
          </div>
        </div>
        <div className="card__value card__value--center">
          <span className="card__value__border">{card.value}</span>
          <span className="card__value__text">{card.value}</span>
        </div>
      </div>
    </div>
  );
};

export default pure(Card);
