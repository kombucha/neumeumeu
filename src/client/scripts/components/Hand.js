import Card from './Card';

export default ({cards}) => (
    <div className="hand">
        <div>
            Mes cartes
        </div>
        <ul className="hand__cards">
            {
                cards.map(card => (
                    <li key={card.value}>
                        <Card className="card--hand" card={card}/>
                    </li>
                ))
            }
        </ul>
    </div>
);
