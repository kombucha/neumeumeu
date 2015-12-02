import {connect} from 'react-redux';
import PureRenderComponent from 'client/components/PureRenderComponent';
import * as actionCreators from 'client/actions';
import GameCreationForm from 'client/components/GameCreationForm';

export default class GameCreation extends PureRenderComponent {

    onCreateGame(game) {
        this.props.createGame(game);
        // TODO: redirect on successful game creation somehow
    }
    render() {
        return (
            <div className="center-col">
                <div className="center-col__inner">
                    <div className="game-creation">
                        <GameCreationForm onCreateGame={this.onCreateGame.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export const GameCreationContainer = connect(
    () => ({}),
    actionCreators
)(GameCreation);
