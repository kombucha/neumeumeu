import Card from './Card';

export default ({cards, onCardSelected}) => (
    <div className="hand">
        <div>
            Mes cartes
        </div>
        <ul className="hand__cards">
            {
                cards.map(card => (
                    <li className="hand__item"
                        key={card.value}
                        onClick={() => onCardSelected(card)}>
                        <Card className="card--hand" card={card}/>
                    </li>
                ))
            }
        </ul>
    </div>
);
