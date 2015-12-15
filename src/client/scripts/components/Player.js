import classNames from 'classnames/dedupe';
import PlayerStatus from 'common/constants/player-status';
import Card from './Card';

export default ({className, player, defaultAvatarURL='/images/players/avatar-default.svg'}) => {
    const avatarURL = player.avatarURL || defaultAvatarURL,
        classes = classNames(
            'player',
            {
                'player--played-card': player.status === PlayerStatus.PLAYED_CARD,
                'player--choosing-pile': player.status === PlayerStatus.HAS_TO_CHOOSE_PILE,
                'player--ai': !!player.AIEnabled
            },
            className
        );

    return (
        <div className={classes}>
            <div className="player__malus">{player.malus}</div>
            <div className="player__username">
                {player.name}
            </div>
            <img className="player__avatar" src={avatarURL} alt="{player.name}'s avatar"/>
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
