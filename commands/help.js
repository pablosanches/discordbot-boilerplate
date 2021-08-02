const Discord = require('discord.js');

exports.run = (client, message, args, level) => {
    let time = Date.now();
    if (args[0]) {
        let command = args[0];
        let clientCommand = client.commands.has(command) || client.aliases.has(command);
        
        if (clientCommand) {
            command = client.commands.get(command);
            var aliases = (command.conf.aliases.length > 0) ? command.conf.aliases : 'NONE';
            var newEmbed = new Discord.MessageEmbed()
                .setTitle(`Command Help: ${command.help.name}`)
                .addField('Description', command.help.description)
                .addField('Category', command.help.category)
                .addField('Usage', command.help.usage)
                .addField('Enabled', command.help.enabled)
                .addField('Disabled in DMs', command.conf.guildOnly)
                .addField('Aliases', aliases)
                .addField('Permission Level', command.conf.permLevel)
                .setFooter(`Time taken: ${Date.now() - time}ms`);

            if (message.channel.type === 'dm' || client.settings.get(message.guild.id).sendHelp == 'chanel') {
                message.channel.send({ embed: newEmbed });
            } else {
                message.author.send({ embed: newEmbed });
                message.react('👍');
            }
            
        } else {
            return message.reply('Command not found');
        }

    } else {
        const myCommands = client.commands.filter(clientCmd => clientCmd.conf.permLevel <= level);
        const commandNames = myCommands.keyArray();
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

        let currentCategory = '';
        var embeds = [];
        embeds[0] = new Discord.MessageEmbed();
        embeds[0].setTitle(`Commands List \n (Use ${client.settings.get(message.guild.id).prefix}help [command name] for details)`);
		embeds[0].setAuthor(client.user.username, client.user.avatarURL || client.user.defaultAvatarURL);

        const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : -1);

        var i = 0,
            embedNumber = 0;

        sorted.forEach(c => {
            i++;

            if (i % 18 === 0) {
                embedNumber++;
                embeds[embedNumber] = new Discord.MessageEmbed();
            }

            const category = c.help.category.toProperCase();
            if (currentCategory !== category) {
                embeds[embedNumber].addField('===', `**${category}**`);
                currentCategory = category;
            }

            embeds[embedNumber].addField(`${c.help.name}${' '.repeat(longest - c.help.name.length)}`, c.help.description);
        });

        if (message.channel.type === 'dm' || client.settings.get(message.guild.id).sendHelp == 'channel') {
            var embedNumber = 0;
            embeds.forEach((embedObject) => {
                embedNumber++;

                embedObject.setColor('11806A');
                if (embedNumber === embeds.length) {
                    embedObject.setFooter(`Time taken ${Date.now() - time}ms`);
                }
                message.channel.send({ embed: embedObject }).catch((err) => {
                    console.error(err);
                });
            });
        } else {
            embeds.forEach((embedObject) => {
                embedObject
                    .setColor('11806A')
                    .setFooter(`Time taken ${Date.now() - time}ms`);

                message.channel.send({ embed: embedObject }).catch((err) => {
                    console.error(err);
                });
            });
            message.react('👍');
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h'],
    permLevel: 0
};

exports.help = {
    name: 'help',
    category: 'System',
    description: 'Displays all the available commands for your permission level',
    usage: 'help\nhelp [command]'
};