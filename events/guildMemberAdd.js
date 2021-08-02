const Discord = require('discord.js');

module.exports = (client, member) => {
    if (member.user.id === client.user.id) return;

    const guildSettings = client.settings.get(member.guild.id);
    const welcomeMessage = guildSettings.welcomeMessage.replace('{{user}}', member.user.tag);

    if (guildSettings.welcomeEnabled) {
        var welcomeChannel = member.guild.channels.find('name', guildSettings.welcomeChannel);
        if (welcomeChannel) {
            welcomeChannel.send(welcomeMessage).catch((err) => {
                client.log('log', `Unable to send message to welcomeChannel (${guildSettings.welcomeChannel}) on ${member.guild.name} (${member.guild.id}): \n ${e}`, 'ERROR');
            });
        }
    }

    const logWelcome = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('New member')
        .addField('User tag', member.user.tag)
        .addField('User ID', member.user.id);
    
    if (guildSettings.logNewMember) {
        member.guild.channels
            .find('name', guildSettings.modLogChannel)
            .send({ embed: logWelcome }).catch((e) => client.log('log', `Unable to send message to modLogChannel (${guildSettings.modLogChannel}) on ${member.guild.name} (${member.guild.id}): \n ${e}`, 'Error'));
    }
};