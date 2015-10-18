Everything in English
For card game terms, see [the glossary of card game terms](https://en.wikipedia.org/wiki/Glossary_of_card_game_terms)

One Game consists of several Deals where Players use all their cards during successive Rounds



IMHO better to use just `int` number to reference cards in all messages and have a "cards description" hash with the complementary info (malus,...) when needed:
1. information about cards is not changing during game
2. we cannot accept malus info from client because of tampering risk
3. simpler event data


# CLIENT SIDE VIEW

```javascript
game: {
  settings           : ..., // from CREATE_GAME event
  cardsDescription   : ..., // from CREATE_GAME event
  playersDescription : ..., // from START_GAME event

  myName             : "Hugo"        // from JOIN_GAME event  
  mySecureHash       : "cf23df2207d99a74fbe169e3eba035e633b65d94",    // from JOIN_GAME response

  state              : ... // from START_DEAL and PLAY_TURN events
}


// Events initiated by CLIENTS (not trusted)
// Should be processed by the server to generate game events, then discarded
clientEvents: [
  {
    name: "LIST_GAMES"  // server returns all infos on games waiting to start
  },
  {
    name: "JOIN_GAME",  // server returns a secure hash identifying player and game for future communication
    gameId: 7,
    player: {
      name: "Vincent",  // Use as player ID, refuse if same name already joined
      avatarIcon: "d7a035e633b65d94..." // base64-encoded png
    },
    password: "..."  // optionally for password protected games
  },
  {
    name: "LEAVE_GAME",  // auto-send this when browser is closed
    secureHash: "cf23df2207d99a74fbe169e3eba035e633b65d94"
  },
  {
    name: "READY_FOR_GAME",  // Server wait for all players ACK before starting the game
    secureHash: "cf23df2207d99a74fbe169e3eba035e633b65d94"
  },
  {
    name: "READY_FOR_DEAL",  // Server wait for all players ACK before starting a new deal
    secureHash: "cf23df2207d99a74fbe169e3eba035e633b65d94"
  },
  {
    name: "READY_FOR_PLAY_TURN",  // Client can send several READY_FOR_PLAY_TURN event if user change is mind, up to the PLAY_TURN event
    playing: 102,
    message: "Por favor!",
    secureHash: "cf23df2207d99a74fbe169e3eba035e633b65d94"
  },
  {
    name: "CHOOSE_STACK",
    stack: 2,
    secureHash: "cf23df2207d99a74fbe169e3eba035e633b65d94"
  }
}
```


# SERVER SIDE VIEW

```javascript
game: {
  id: 7,

  settings: {   // read from config file(YAML?)
    maxPlayers: 5,
    cardsPerDeal: 10,
    endIfMalusIs: 77,
    endIfNbDealsIs: 8,
    endIfDurationIs: 1800
    timePerRound: 45,
    timeToChooseStack: 30,
    delayBetweenTurns: 5
  },

  cardsDescription: {    // generated / or read from config file
    59: {
      malus: 1
      icon: "..."  // optionally for custom design
    }
    91: {
      malus: 1
    },
    102 : {
      malus: 1
    }
  },

  playersDescription: [   // update on JOIN_GAME and LEAVE_GAME events from clients
    {
      name: "Vincent",
      avatarIcon: "d7a035e633b65d94...", // base64-encoded png
      statistics: ... // optionally total games won / lost, etc...
    },
    {
      name: "Hugo",
      avatarIcon: "d7a035e633b65d94...", // base64-encoded png
      isReadyForGame: false,
      statistics: ... // optionally total games won / lost, etc...
    }
  ],

  state: {
    players:[
      {
        name: "Hugo",
        malusScore: 22,
        isReadyForGame: false,     // \
        isReadyForDeal: false,     //  - Game / Deal / Turn start when all players are ready
        isReadyForPlayTurn: true,  // /
        hand: [34,79],
        playing: 34,      // updated on receive READY_FOR_PLAY_TURN from client(value must be in current cards)
        playingMsg: "..." // updated on receive READY_FOR_PLAY_TURN from client
      },
      {
        name: "Vincent",
        malusScore: 37,
        isReadyForGame: false,     // \
        isReadyForDeal: false,     //  - Game / Deal / Turn start when all players are ready
        isReadyForPlayTurn: false, // /
        hand: [12,28],
        playing: 28,      // updated on receive READY_FOR_PLAY_TURN from client(value must be in current cards)
        playingMsg: "..." // updated on receive READY_FOR_PLAY_TURN from client
      }
    ],
    playStacks:[
      [8],
      [59],
      [36,48],
      [91,102]
    ],
  },

  deck: [76, 13, 28, 6, 81, ...],

  events:[
    ...   // all server events up until now
  ]
}


// Events initiated by SERVER (trusted)
// Should be able to replay a game using only server events
// Not described here, but every server event should be linked to:
// * a game id
// * a timestamp format ISO 8601: "2015-10-15T18:25:43.511Z"
gameEvents: [
  {
    name: "CREATE_GAME",
    settings: ... // from game.settings
    cardsDescription: ... // from game.cardsDescription
  },
  {
    name: "WAITING_FOR_GAME",  // send each time we receive a JOIN_GAME, LEAVE_GAME, or READY_FOR_GAME event (players can join until START_GAME)
    isReadyForGame: {    // from game.state.players.isReadyForGame
      "Hugo": true,             
      "Vincent": false
    }
  },
  {
    name: "START_GAME",  // start when all players sent READY_FOR_GAME
    playersDescription : ...  // from game.playersDescription
  },
  {
    name: "WAITING_FOR_DEAL",  // send each time we receive a READY_FOR_DEAL event
    isReadyForDeal: {    // from game.state.players.isReadyForDeal
      "Hugo": true,             
      "Vincent": false
    }
  },
  {
    name: "START_DEAL",   // start when all players sent READY_FOR_DEAL
    state: ...            // from SANITIZE(game.state) => cards of other players must be replaced by '*'
  },
  {
    name: "START_TURN",   // start automatically after previous turn end + <delayBetweenTurns> delay
  },
  {
    name: "WAITING_FOR_PLAY_TURN",  // send each time we receive a READY_FOR_PLAY_TURN event (players can re-send it until PLAY_TURN)
    isReadyForPlayTurn: {    // from game.state.players.isReadyForPlayTurn
      "Hugo": true,             
      "Vincent": false
    }
  },
  {
    name: "PLAY_TURN",    // start when all players sent READY_FOR_PLAY_TURN
    state: ...            // from SANITIZE(game.state) => cards of other players must be replaced by '*'
    mustChooseStack: "Hugo",
    stackChoosen: null   // if mustChooseStack != null, this event is updated and sent again when receiving CHOOSE_STACK from client
  },
  {
    name: "END_GAME",
    reason: "..." // finished because of malus / or nb deals / or duration
  }
]
```
