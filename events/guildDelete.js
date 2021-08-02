module.exports = (client, guild) => {
    client.log('log', `Left guild ${guild.name} (${guild.id})`, 'GUILD');
    client.settings.delete(guild.id);

    var guildCount = client.guild.size,
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