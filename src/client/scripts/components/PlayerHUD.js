import Hand from 'client/components/Hand';
import Card from 'client/components/Card';
import Malus from 'client/components/Malus';
import {sort} from 'common/utils';

export default({player, onHandCardClicked, onSelectedCardClicked}) => {
    const sortedCards = sort(player.hand, (a, b) => a.value - b.value);

    return (
        <div className="player-hud">
            <div className="player-hud__card-placeholder">
                {
                    player.chosenCard
                    ? <Card card={player.chosenCard} onClick={onSelectedCardClicked}/>
                    : null
                }
            </div>
            <Hand cards={sortedCards} onCardSelected={onHandCardClicked}/>
            <Malus malus={player.malus}/>
        </div>
    );
};
