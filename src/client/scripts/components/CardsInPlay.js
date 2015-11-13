import CardPile from './CardPile';

export default ({piles}) => (
    <div className="cards-in-play">
        <ul className="cards-in-play__piles">
            {
                piles.map((pile, index) => (
                    <li className="cards-in-play__pile" key={index}>
                        <CardPile className="card-pile--in-play" cards={pile} />
                    </li>
                ))
            }
        </ul>
    </div>
);
