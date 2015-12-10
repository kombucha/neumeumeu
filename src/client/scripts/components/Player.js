import classNames from 'classnames/dedupe';
import Card from './Card';

export default ({className, player, defaultAvatarURL='/images/players/avatar-default.svg'}) => {
    const avatarURL = player.avatarURL || defaultAvatarURL,
        classes = classNames('player', className);

    return (
        <div className={classes}>
            <img className="player__avatar" src={avatarURL} alt="{player.name}'s avatar"/>
            <div className="player__username">
                {player.name}
            </div>
            <div className="player__card">
                {
                    player.chosenCard
                        ? (<Card className="card--player" card={player.chosenCard}/>)
                        : (<div className="player__card-placeholder"></div>)
                }
            </div>
        </div>
    );
};
