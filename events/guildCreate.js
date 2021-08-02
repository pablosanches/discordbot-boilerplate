module.exports = (client, guild) => {
    wait(1000);
    client.log('log', `Joined guild ${guild.name} (${guild.id})`, 'GUILD');
    client.settings.set(guild.id, client.config.defaultSettings);

    var guildCount = client.guilds.size,
        game = client.config.playingGame
            .replace('{{prefix}}', client.config.defaultSettings.prefix)
            .replace('{{guilds}}', guildCount);
    client.user.setPresence({
        status: client.config.status,
        game: {
            name: game,
            type: 0
        }
    });
};