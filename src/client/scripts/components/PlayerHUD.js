import Hand from 'client/components/Hand';
import Malus from 'client/components/Malus';
import {sort} from 'common/utils';

export default({player, onCardSelected}) => {
    const sortedCards = sort(player.hand, (a, b) => a.value - b.value);

    return (
        <div className="player-hud">
            <Hand cards={sortedCards} onCardSelected={onCardSelected}/>
            <Malus malus={player.malus}/>
        </div>
    );
};
