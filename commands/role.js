exports.run = async (client, message, args, level) => {
    var user = message.mentions.members.first(),
        roleName = args.splice(2).join(' '),
        role = message.guild.roles.find('name', roleName);

    if (!user) return message.reply('You need to mention a valid user of this server');
    if (!roleName) return message.reply('You can\'t give no roles');
    if (!message.guild.roles.find('name', roleName)) return message.reply('No role with this name exists. _Roles name are case-sensitive_');
    
    switch (args[0]) {
        case 'add':
            if (user.roles.exists('name', roleName)) return message.reply(':eyes: I see this role on that user already');
            user.addRole(role).then(() => message.reply('Role added')).catch((err) => message.reply('Unable to add role').then(() => console.log(err)));
        break;

        case 'remove':
            if (!user.roles.find('name', roleName)) return message.reply('Does that user even have the role?');
            user.removeRole(role).then(() => message.reply('Role removed')).catch((err) => message.reply('Unable to remove role').then(() => console.log(err)));
        break;

        default:
            message.reply('Well, you can olny add or remove roles...');
        break;
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: 'role',
    category: 'Moderation',
    description: 'Allows you to add or remove a single role from a user',
    usage: 'role [add/remove] [user mention] [role name]'
}