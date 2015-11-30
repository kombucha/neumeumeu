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
                player.card ? (
                    <Card className="card--small" card={player.card}/>
                ) : null
            }
            </div>
        </div>
    );
};
