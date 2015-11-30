import {connect} from 'react-redux';

import GameStatus from 'common/constants/game-status';
import GameItem from 'client/components/GameItem';
import {joinGame, spectateGame} from 'client/actions';

function canJoin(game, player) {
    return (game.status === GameStatus.WAITING_FOR_PLAYERS) ||
        game.players.some(p => p.id === player.id);
}

export const GameList = ({games, currentPlayer, joinGame, spectateGame}) => {
    return (
        <ul className="game-list">
            {
                games.length > 0 ? games.map((game) => (
                    <li className="game-list__item" key={game.id}>
                        <GameItem game={game}
                            canJoin={canJoin(game, currentPlayer)}
                            onJoin={game => joinGame(game.id)}
                            onSpectate={game => spectateGame(game.id)} />
                    </li>
                )) : <li>Aucune partie ouverte</li>
            }
        </ul>
    );
};

function mapStateToProps(state) {
    return {
        games: state.games || [],
        currentPlayer: state.authentication.player || {}
    };
}

const GameListContainer = connect(
    mapStateToProps,
    {joinGame, spectateGame}
)(GameList);

export default GameListContainer;
