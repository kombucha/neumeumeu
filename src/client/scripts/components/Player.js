import Card from './Card';

export default ({player, defaultAvatarURL='/images/players/avatar-default.svg'}) => {
    const avatarURL = player.avatarURL || defaultAvatarURL;

    return (
        <div className="player">
            <img className="player__avatar" src={avatarURL} alt="{player.name}'s avatar"/>
            <div className="player__username">
                {player.name}
            </div>
            <div className="player__card">
            {
                player.chosenCard ? (
                    <Card className="card--small" card={player.chosenCard}/>
                ) : null
            }
            </div>
        </div>
    );
};
