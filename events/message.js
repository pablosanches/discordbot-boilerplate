module.exports = (client, message) => {
    if (message.author.bot) return;
    
    const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;
    
    const args = message.content.split(/\s+/g);
    var command;
    
    message.settings = settings;
    command = args
    .shift()
    .slice(settings.prefix.length)
    .toLowerCase();

    const level = client.permlevel(message);
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (message.channel.type === 'dm') {
        if (!cmd) return;
        if (cmd.conf.guildOnly) return message.channel.send('This command is disabled in DMs');
    }

    if (message.channel.type != 'dm') {
        const guildSettings = client.settings.get(message.guild.id);
        if (message.content.match(/(discord\.(gg|me|io)|(discordapp\.com|discord\.com)\/invite).*/) && guildSettings.inviteFilterEnabled === 'true') {
            var msgInv = message.content.match(/discord\.gg\/[0-9A-Za-z-]+/);
            if (!msgInv) return;

            var dggInvCode = msgInv[0].replace(/discord\.gg\//, '');
            var whitelist = guildSettings.inviteWhitelist;
            if (whitelist.includes(dggInvCode)) return;

            if (level >= 2) {
                return console.log(`${message.author.tag} (${message.author.id}) bypassed the invite link filter due to having a level of ${level}`);
            }

            message.delete();
            message.reply('Invite links are not allowed');
        }

        // if (guildSettings.swearFilter && guildSettings.swearWords.some(word => message.content.include(word))) {
        //     message.delete();
        //     message.reply('Swear words are not allowed');
        // }

        if (guildSettings.facepalms && (message.content.toLowerCase()
            .indexOf('facepalm') !== -1 || message.content.indexOf('🤦') !== -1)) { // Because why not. TODO: Add cooldown
            message.channel.send(':face_palm:');
        }

        if (message.content.indexOf(guildSettings.prefix) !== 0) {
            return;
        }

        var commandTimeout = parseInt(guildSettings.commandTimeout);
        if (client.talkedRecently.has(message.author.id)) {
            return message.reply(`You need to wait ${commandTimeout}ms seconds between each command`);
        }

        if (level < 2) {
            client.talkedRecently.add(message.author.id);
            setTimeout(() => {
                client.talkedRecently.delete(message.author.id);
            }, commandTimeout);
        }

        if (guildSettings.logCommandUsage) {
            if (cmd) {
                if (level >= cmd.conf.permLevel) {
                    if (cmd.conf.enabled) {
                        cmd.run(client, message, args, level);
                        console.log('log', `${message.guild.name}/#${message.channel.name} (${message.channel.id}):${message.author.username} (${message.author.id}) run command ${message.content}`, 'CMD');
                    } else {
                        message.reply('This command is disabled');
                        client.log('log', `${message.guild.name}/#${message.channel.name} (${message.channel.id}):${message.author.username} (${message.author.id}) tried to run disabled command ${message.content}`, 'CMD');
                    }
                } else {
                    client.log('log', `${message.guild.name}/#${message.channel.name} (${message.channel.id}):${message.author.username} (${message.author.id}) tried to run command ${message.content} without having the correct permission level`, 'CMD');
                }
            } else {
                client.log('log', `${message.guild.name}/#${message.channel.name} (${message.channel.id}):${message.author.username} (${message.author.id}) tried to run non-existant command ${message.content}`, 'CMD');
            }
        } else {
            cmd.run(client, message, args, level);
        }
    } else if (cmd) {
        if (level >= cmd.conf.permLevel) {
			if (cmd.conf.enabled) {
				cmd.run(client, message, args, level);
				if (client.config.defaultSettings.logCommandUsage === 'true') {
                    client.log('log', `DM: ${message.author.username} (${message.author.id}) ran command ${message.content}`, 'CMD');
                }

			} else if (client.config.defaultSettings.logCommandUsage === 'true') {
                client.log('log', `DM: ${message.author.username} (${message.author.id}) tried to run disabled command ${message.content}`, 'CMD');
            }
		} else if (client.config.defaultSettings.logCommandUsage === 'true') {
            client.log('log', `DM: ${message.author.username} (${message.author.id}) tried to run command without permissions: ${message.content}`, 'CMD');
        }
    }
};