const moment = require('moment');

module.exports = (client) => {
    client.permlevel = message => {
        let permlvl = 0;
        var ownerID = client.config.ownerID;

        if (message.author.id === ownerID) return 10;
        if (message.channel.type === 'dm' || !message.member) return 0;

        try {
			const modRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
			if (modRole && message.member.roles.cache.has(modRole.id)) permlvl = 2;
		} catch (e) {
			console.warn('modRole not present in guild settings. Skipping Moderator (level 2) check');
		}

		try {
			const adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
			if (adminRole && message.member.roles.cache.has(adminRole.id)) permlvl = 3;
		} catch (e) {
			console.warn('adminRole not present in guild settings. Skipping Administrator (level 3) check', e);
		}

        if (message.author.id === message.guild.owner.id) permlvl = 4;
        
        return permlvl;
    };

    client.permLevels = {
		0: 'User',
		2: 'Guild Moderator',
		3: 'Guild Administrator',
		4: 'Guild Owner',
		10: 'Bot Owner'
	};

    /**
     * LOGGING FUNCTION
     */
     client.log = (type, msg, title) => {
		var time = moment().format(client.config.logTimeFormat);
		if (!title) title = 'Log';
		console.log(`${time}: [${type}] [${title}] ${msg}`);
	};

    /**
     * SINGLE LINE AWAIT MESSAGE
     */
     client.awaitReply = async (msg, question, limit = 60000) => {
		const filter = m => m.author.id = msg.author.id;
		await msg.channel.send(question);
		try {
			const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
			return collected.first().content;
		} catch (e) {
			return false;
		}
	};

    /**
     * CLEAR MESSAGE
     */
     client.clean = (client, text) => {
		if (typeof evaled !== 'string') text = require('util').inspect(text, { depth: 0 });
		var t = text
			.replace(/`/g, '`' + String.fromCharCode(8203)) // eslint-disable-line prefer-template
			.replace(/@/g, '@' + String.fromCharCode(8203)) // eslint-disable-line prefer-template
			.replace(/\n/g, '\n' + String.fromCharCode(8203)) // eslint-disable-line prefer-template
			.replace(client.config.token, 'mfa.VkO_2G4Qv3T-- NO TOKEN HERE --')
			.replace(client.config.dashboard.oauthSecret, 'Nk-- NOPE --')
			.replace(client.config.dashboard.sessionSecret, 'B8-- NOPE --')
			.replace(client.config.cleverbotToken, 'CC-- NOPE --')
			.replace(client.config.googleAPIToken, 'AI-- NOPE --...');

		return t;
	};

    /**
     * MISC NON CRITICAL FUNCTIONS
     * @returns 
     */
    String.prototype.toProperCase = function() {
		return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	// `await wait(1000);` to "pause" for 1 second.
	global.wait = require('util').promisify(setTimeout);


	// Another semi-useful utility command, which creates a "range" of numbers
	// in an array. `range(10).forEach()` loops 10 times for instance. Why?
	// Because honestly for...i loops are ugly.
	global.range = (count, start = 0) => {
		const myArr = [];
		for (var i = 0; i < count; i++) {
			myArr[i] = i + start;
		}
		return myArr;
	};

	client.version = require('../package.json').version;

	// These 2 simply handle unhandled things. Like Magic. /shrug
	process.on('uncaughtException', (err) => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './'); // eslint-disable-line no-useless-escape
		console.error('Uncaught Exception: ', errorMsg);
	});

	process.on('unhandledRejection', err => {
		console.error('Uncaught Promise Error: ', err);
	});
};