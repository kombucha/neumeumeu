import CardPile from './CardPile';

export default ({piles}) => (
    <div className="cards-in-play">
        <div>Cartes en jeux</div>
        <div className="cards-in-play__piles">
            {
                piles.map((pile, index) => (
                    <div className="cards-in-play__pile" key={index}>
                        <CardPile className="card-pile--in-play" cards={pile} />
                    </div>
                ))
            }
        </div>
    </div>
);
