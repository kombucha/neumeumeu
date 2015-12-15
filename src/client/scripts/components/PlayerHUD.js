import Hand from 'client/components/Hand';
import Malus from 'client/components/Malus';
import PlayerMenu from 'client/components/playerMenu';
import {sort} from 'common/utils';

export default({player, gameId, onHandCardClicked}) => {
    const sortedCards = sort(player.hand, (a, b) => a.value - b.value);
    let handClasses = player.status === 'choosing_card' ? 'choosing-card' : null;

    return (
        <div className="player-hud">
            {
                player.status === 'choosing_pile'
                    ? (
                        <div className="player-hud__info">
                            <span className="player-hud__info-text">Would you kindly choose a pile ?</span>
                        </div>
                    )
                    : null
            }
            <div className="player-hud__main">
                <PlayerMenu player={player} gameId={gameId}/>
                <Hand cards={sortedCards} onCardSelected={onHandCardClicked} className={handClasses}/>
                <Malus malus={player.malus}/>
            </div>
        </div>
    );
};
