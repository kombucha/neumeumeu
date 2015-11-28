import {connect} from 'react-redux';

import GameItem from 'client/components/GameItem';
import {joinGame, spectateGame} from 'client/actions';

export const GameList = ({games, joinGame, spectateGame}) => (
    <ul className="game-list">
        {
            games.length > 0 ? games.map((game) => (
                <li className="game-list__item" key={game.id}>
                    <GameItem game={game}
                        onJoin={game => joinGame(game.id)}
                        onSpectate={game => spectateGame(game.id)} />
                </li>
            )) : <li>Aucune partie en cours</li>
        }
    </ul>
);

function mapStateToProps(state) {
    return {
        games: state.games || []
    };
}

const GameListContainer = connect(
    mapStateToProps,
    {joinGame, spectateGame}
)(GameList);

export default GameListContainer;
