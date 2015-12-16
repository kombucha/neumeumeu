import Velocity from 'velocity-animate';

const animationSettings = {
    duration: 400,
    delay: 500,


    cardTranslateX: '-25%',
    cardScale: '0.4',
    cardHeight: 200,
    pileSpace: 40
};


function animate(step, gameDomElement) {
    return play(step, gameDomElement);
}

function play(step, gameDomElement) {
    if (step.hasOwnProperty('fromPlayer')) {
        return animateCard(step.fromPlayer, step.toPile, gameDomElement);

    } else if (step.hasOwnProperty('fromPile')) {
        return animatePile(step.fromPile, step.toPlayer, gameDomElement);
    }
}

function animateCard(fromPlayer, toPile, gameDomElement) {
    var card = getCardFromPlayer(fromPlayer, gameDomElement),
        innerCard = card.getElementsByClassName('card--player')[0],
        cardCoord = card.getBoundingClientRect(),
        pileCoord = getPile(toPile, gameDomElement).getBoundingClientRect(),

        cardEndCoords = {
            top: pileCoord.top + pileCoord.height - (pileCoord.height > 0 ? (animationSettings.cardHeight - animationSettings.pileSpace) : 0),
            left: pileCoord.left
        },

        options = {
            duration: animationSettings.duration,
            delay: animationSettings.delay
        },

        cardProp = {
            top: [cardEndCoords.top, cardCoord.top],
            left: [cardEndCoords.left, cardCoord.left],
        },

        innerCardProp = {
            translateX: [0, animationSettings.cardTranslateX],
            scale: [1, animationSettings.cardScale]
        };

    // Init card's CSS
    setStyle(card, {
        position: 'absolute',
        margin: 0
    });

    return new Promise((resolve, reject) => {
        Velocity(innerCard, innerCardProp, options);
        options.complete = function() {
            resolve();
        };
        Velocity(card, cardProp, options);
    });
}

function animatePile(fromPile, toPlayer, gameDomElement) {
    var pile = getPile(fromPile, gameDomElement),
        pileCards = pile.getElementsByClassName('card--pile'),
        card = pileCards[0].getBoundingClientRect(),
        playerCoord = getPlayer(toPlayer, gameDomElement).getBoundingClientRect(),

        options = {
            duration: animationSettings.duration,
            delay: animationSettings.delay
        },

        pileCardsProp = {
            top: playerCoord.top - card.height / 2 + playerCoord.height / 2,
            left: playerCoord.left - card.width / 2 + playerCoord.width / 2,
            scale: 0.2,
            rotateZ: [45, 0]
        };

    // Init pileCard's CSS
    Array.prototype.slice.call(pileCards).forEach(function(pileCard) {
        var pileCardCoord = pileCard.getBoundingClientRect();
        setStyle(pileCard, {
            position: 'absolute',
            top: pileCardCoord.top + 'px',
            left: pileCardCoord.left + 'px'
        });
    });

    return new Promise((resolve, reject) => {
        options.complete = resolve;
        Velocity(pileCards, pileCardsProp, options);
    });
}

// UTILS

function setStyle(element, styles) {
    Object.keys(styles).forEach(function(style) {
        element.style[style] = styles[style];
    });
}

function getCardFromPlayer(player, gameDomElement) {
    return gameDomElement
        .querySelectorAll('.players .player__card')[player];
}

function getPile(pile, gameDomElement) {
    return gameDomElement
        .querySelectorAll('.cards-in-play__piles .card-pile')[pile];
}

function getPlayer(player, gameDomElement) {
    return gameDomElement
        .querySelectorAll('.players .player__avatar')[player];
}

export default animate;
