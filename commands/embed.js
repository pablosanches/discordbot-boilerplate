const Discord = require('discord.js');
exports.run = (client, message, args) => {
    let msg = args.join(' ');
    if (!msg) return message.reply('Need content for the embed');

    const embed = new Discord.MessageEmbed()
        .setDescription(msg)
        .setColor([114, 137, 217]);
    
    message.channel.send({ embed });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: 'embed',
    category: 'Miscelaneous',
    description: 'Embeds something',
    usage: 'embed [description]'
};