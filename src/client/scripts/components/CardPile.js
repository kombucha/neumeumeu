import Card from './Card';

export default ({cards}) => (
    <ul className="card-stack">
        {
            cards.map(card => (
                <li key={card.value}>
                    <Card className="card--stack" card={card}/>
                </li>
            ))
        }
    </ul>
);
