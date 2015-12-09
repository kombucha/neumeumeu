import Hand from 'client/components/Hand';
import Malus from 'client/components/Malus';
import {sort} from 'common/utils';

export default({player, onHandCardClicked}) => {
    const sortedCards = sort(player.hand, (a, b) => a.value - b.value);

    return (
        <div className="player-hud">
            {player.status === 'choosing_pile' ? (<div> Would you kindly choose a pile ?</div>) : null}
            <Hand cards={sortedCards} onCardSelected={onHandCardClicked}/>
            <Malus malus={player.malus}/>
        </div>
    );
};
