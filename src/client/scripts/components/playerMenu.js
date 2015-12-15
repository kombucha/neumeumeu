import {AIToggleContainer} from 'client/components/AIToggle';

export default({player, gameId}) => {

    return (
        <div className="player-menu">
            <AIToggleContainer player={player} gameId={gameId}/>
        </div>
    );
};
