import {connect} from 'react-redux';
import {Link} from 'react-router';
import PureRenderComponent from 'client/components/PureRenderComponent';
import GameList from 'client/components/GameList';
import {LoginStatusContainer} from 'client/components/LoginStatus';
import StrokedText from 'client/components/StrokedText';
import GameStatus from 'common/constants/game-status';
import {register, fetchGames, joinGame, joinRoom, leaveRoom} from 'client/actions';
import {updatePath} from 'redux-simple-router';

export default class Home extends PureRenderComponent {

    componentWillMount() {
        const playerId = this.props.player ? this.props.player.id : undefined;

        this.props.joinRoom('lobby');
        this.props.fetchGames(playerId);
    }

    componentWillUnmount() {
        this.props.leaveRoom('lobby');
    }

    renderPlayersGames(games) {
        return (
            <div className="home__section">
                <h2 className="home__section-title">My Games</h2>
                <GameList games={games} onSelectGame={this.onSelectPlayersGame.bind(this)}/>
            </div>
        );
    }

    onSelectPlayersGame(game) {
        this.props.updatePath(`/games/${game.id}`);
    }

    onSelectCurrentGame(game) {
        this.props.joinGame(game.id);
    }

    render() {
        const isAuthenticated = !!this.props.player,
            {playersGames, currentGames} = this.props;

        return (
            <div className="home">
                <div className="center-col">
                    <div className="center-col__inner">

                        <LoginStatusContainer/>

                        <Link className="button" to="/games/create">
                            <StrokedText text="Create Game"/>
                        </Link>

                        {isAuthenticated ? this.renderPlayersGames(playersGames) : null}

                        <div className="home__section">
                            <h2 className="home__section-title">Current Games</h2>
                            <GameList games={currentGames} onSelectGame={this.onSelectCurrentGame.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function isPlayerPartOfGame(game, playerId) {
    return game.players.some(p => p.id === playerId);
}

function canJoinGame(game) {
    return game.status === GameStatus.WAITING_FOR_PLAYERS;
}

function mapStateToProps(state) {
    // Should data massaging happen here ?
    const games = state.games || [],
        player = state.authentication.player,
        playerId = player ? player.id : undefined,
        playersGames = games.filter(g => isPlayerPartOfGame(g, playerId)),
        currentGames = games.filter(g => canJoinGame(g) && !playersGames.some(g2 => g.id === g2.id));

    return {
        playersGames,
        currentGames,
        player
    };
}

export const HomeContainer = connect(
    mapStateToProps,
    Object.assign({},
        {register, fetchGames, joinGame, joinRoom, leaveRoom},
        {updatePath}
    )
)(Home);
