exports.run = async (client, message, args, level) => {
    message.reply(`Your permission level: ${level} (${client.permLevel[level]})`);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'permlevel',
    category: 'Miscelaneous',
    description: 'Returns your permission level',
    usage: 'permlevel'
};