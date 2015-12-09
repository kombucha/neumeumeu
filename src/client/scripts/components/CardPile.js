import classNames from 'classnames/dedupe';
import Card from './Card';

export default ({cards, className, onClick}) => {
    const classes = classNames('card-pile', className, {'card-pile--selectable': true});

    return (
        <ul className={classes} onClick={onClick}>
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
