import classNames from 'classnames/dedupe';
import Card from './Card';

export default ({cards, className}) => {
    const classes = classNames('card-pile', className);

    return (
        <ul className={classes}>
            {
                cards.map(card => (
                    <li className="card-pile__item" key={card.value}>
                        <Card className="card--pile" card={card}/>
                    </li>
                ))
            }
        </ul>
    );
};
