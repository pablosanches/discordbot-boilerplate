module.exports = async client => {

    if (!client.user.bot) {
        client.log('ERROR', 'This code must be run on a bot user. Running this bot code on a normal user may not work as expected and is against the Discord Terms of Service.', 'INFO');
        return proccess.exit(0);
    }

    await wait(1000);

    client.appInfo = await client.fetchApplication();
    setInterval(async () => {
		client.appInfo = await client.fetchApplication();
	}, 60000);

	
    var cachedMembers = client.users.cache.filter(u => u.id !== '1').size; // Get's number of members cached. (Filters out Clyde)
	var guildsCount = client.guilds.cache.size;
	// Both `wait` and `client.log` are in `./modules/functions`.
	client.log('EVENT', `Logged into '${client.user.tag}' (${client.user.id}). Ready to serve ${cachedMembers} users in ${guildsCount} guilds. Bot Version: ${client.version}`);

	// Ensure that any guild added while the bot was offline gets a default configuration.
	var g = [];
	client.guilds.cache.forEach(guild => g.push(guild.id));

	for (var i = 0; i < g.length; i++) {
		if (!client.settings.get(g[i])) {
			client.settings.set(g[i], client.config.defaultSettings);
		}
	}

	var game = client.config.playingGame.replace('{{prefix}}', client.config.defaultSettings.prefix).replace('{{guilds}}', guildsCount).replace('{{version}}', client.version);
	client.user.setPresence({ status: client.config.status, game: { name: game, type: 0 } });
};