
const NUMBER_OF_CARDS = 104;

function generateCard(cardNumber) {
    return {
        number: cardNumber,
        penality: computePenality(cardNumber)
    };
}

function computePenality(cardNumber) {
    if (cardNumber === 55) {
        return 7;
    } else if (cardNumber % 10 === 0) {
        return 3;
    } else if (cardNumber % 5 === 0) {
        return 2;
    }

    return 1;
}

export function generateDeck() {
    let deck = [], cardNumber;

    for (cardNumber = 1; cardNumber <= NUMBER_OF_CARDS; cardNumber++) {
        deck.push(generateCard(cardNumber));
    }

    return deck;
}

// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
export function shuffle(deck) {
    let deckCopy = deck.slice(),
        counter = deckCopy.length, temp, index;

    // While there are elements in the deckCopy
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = deckCopy[counter];
        deckCopy[counter] = deckCopy[index];
        deckCopy[index] = temp;
    }

    return deckCopy;
}
