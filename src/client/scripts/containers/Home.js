import {connect} from 'react-redux';
import {Link} from 'react-router';
import PureRenderComponent from 'client/components/PureRenderComponent';
import GameList from 'client/components/GameList';
import {LoginStatusContainer} from 'client/components/LoginStatus';
import {register, fetchGames, joinRoom, leaveRoom} from 'client/actions';

export default class Home extends PureRenderComponent {

    componentWillMount() {
        this.props.joinRoom('lobby');
        this.props.fetchGames();
    }

    componentWillUnmount() {
        this.props.leaveRoom('lobby');
    }

    render() {
        return (
            <div className="home">
                <LoginStatusContainer/>
                <Link to="/games/create">Create Game</Link>
                <GameList games={this.props.games}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        games: state.games || []
    };
}

export const HomeContainer = connect(
    mapStateToProps,
    {register, fetchGames, joinRoom, leaveRoom}
)(Home);
