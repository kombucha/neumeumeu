import { pickRandom, sortBy, sum } from "common/utils";
import log from "server/log";

function computeTotalCardMalus(cards) {
  return sum("malus", cards);
}

function min(arr) {
  return arr.reduce((lowestValue, value) => {
    if (lowestValue === null || value < lowestValue) {
      return value;
    }

    return lowestValue;
  }, null);
}

// C/C -> to be refactored out of services/ai and services/gameplay
function destinationPileIdx(card, piles) {
  return piles.reduce((resultIdx, pile, idx, piles) => {
    const currentTopCard = pile[pile.length - 1],
      resultPile = piles[resultIdx],
      resultTopCard = resultPile
        ? resultPile[resultPile.length - 1]
        : { value: -1 };
    return currentTopCard.value < card.value &&
      currentTopCard.value >= resultTopCard.value
      ? idx
      : resultIdx;
  }, -1);
}

/*
 * Always take piles withest the lowest value
 * If several piles have the same (lowest) value, pick a random one among them
 */
function choosePileIdx(cardsInPlay) {
  const maluses = cardsInPlay.map(computeTotalCardMalus),
    lowestValue = min(maluses),
    lowestValuesIndexes = maluses.reduce((acc, val, idx) => {
      if (val === lowestValue) {
        acc.push(idx);
      }

      return acc;
    }, []);

  return pickRandom(lowestValuesIndexes);
}

/*
 * Naive card score computing :
 * - Project card destination
 * - Compute malus
 * - Compute risk of taking coeff
 * -- 100% if we put a card smaller than the cards in play
 * -- 0% if safe bet
 * -- else percentage dependent on pile height
 * - Return malus * riskCoeff
 */
function cardScore(card, cardsInPlay, playersCount) {
  let projectedPileIdx = destinationPileIdx(card, cardsInPlay),
    isChoosePileMode = projectedPileIdx === -1,
    destinationMalus,
    riskCoeff;

  if (isChoosePileMode) {
    projectedPileIdx = choosePileIdx(cardsInPlay);
  }

  destinationMalus = computeTotalCardMalus(cardsInPlay[projectedPileIdx]);

  if (isChoosePileMode) {
    riskCoeff = 1;
  } else {
    let projectedPile = cardsInPlay[projectedPileIdx],
      pileHeight = projectedPile.length,
      topCard = projectedPile[pileHeight - 1],
      possibleInBetweenCards = card.value - topCard.value - 1,
      maxPilePosition =
        pileHeight + Math.min(possibleInBetweenCards, playersCount - 1) + 1;

    if (maxPilePosition <= 5) {
      riskCoeff = 0;
    } else {
      // TODO: less dumb risk calculation ?
      riskCoeff = cardsInPlay[projectedPileIdx].length / 5;
    }
  }

  return destinationMalus * riskCoeff;
}

function chooseCard(hand, cardsInPlay, playersCount) {
  const cardsScores = hand.map(card => ({
      value: card.value,
      score: cardScore(card, cardsInPlay, playersCount),
    })),
    sortedCardsScores = sortBy("score", cardsScores);

  log.info("SCORES", playersCount, { scores: sortedCardsScores.slice(0, 3) });

  // Pick random lowest scores
  return sortedCardsScores[0].value;
}

export default {
  choosePileIdx,
  chooseCard,
};
