import CardPile from './CardPile';

function isPileEmpty(pile) {
    return pile.length === 0;
}

export default ({piles, onPileSelected}) => (
    <div className="cards-in-play">
        <ul className="cards-in-play__piles">
            {
                piles.map((pile, index) => (
                    <li className="cards-in-play__pile" key={index}>
                        {
                            isPileEmpty(pile)
                            ? (<div className="cards-in-play__placeholder"></div>)
                            : <CardPile
                                className="card-pile--in-play"
                                cards={pile}
                                onClick={() => onPileSelected(index)} />
                        }
                    </li>
                ))
            }
        </ul>
    </div>
);
