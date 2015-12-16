import {copyArray} from 'common/utils';

function updateCurrentGame(state, game) {
    return game;
}

function applyResolutionStep(game, step) {
    if (!game.resolutionSteps || step !== game.resolutionSteps[0]) {
        throw new Error('Invalid step resolution, you\'re doing it wrong', step);
    }

    const newSteps = copyArray(game.resolutionSteps),
        players = copyArray(game.players),
        cardsInPlay = copyArray(game.cardsInPlay),
        gameAtNextStep = {
            players,
            cardsInPlay,
            resolutionSteps: newSteps
        };
    let newPlayer, playerIdx;
    newSteps.shift();

    // Apply step
    if (step.hasOwnProperty('fromPlayer')) {
        // From player to pile
        playerIdx = step.fromPlayer;

        cardsInPlay[step.toPile] = cardsInPlay[step.toPile].concat(players[playerIdx].chosenCard);
        newPlayer = Object.assign({}, players[playerIdx], {
            chosenCard: null
        });
    } else {
        // From pile to player
        const newMalus = cardsInPlay[step.fromPile].reduce((sum, card) => sum + card.malus, 0);
        playerIdx = step.toPlayer;

        cardsInPlay[step.fromPile] = [];
        newPlayer = Object.assign({}, players[playerIdx], {
            chosenPile: null,
            malus: players[playerIdx].malus + newMalus
        });
    }

    players.splice(playerIdx, 1, newPlayer);

    return Object.assign({}, game, gameAtNextStep);
}

export default function games(state = null, action) {
    switch (action.type) {
    case 'UPDATE_CURRENT_GAME':
        return updateCurrentGame(state, action.game);
    case 'APPLY_RESOLUTION_STEP':
        return applyResolutionStep(state, action.step);
    case 'CLEAR_CURRENT_GAME':
        return null;
    }

    return state;
}
