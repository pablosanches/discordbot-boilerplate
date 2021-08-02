const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

exports.run = async(client, message, args, level) => {
    if (!args[0]) return message.reply('Command to reload not in args');
    if (client.commands.get(args[0])) return message.reply('Command already loaded. Use `reload` command');

    const cmdFiles = await readdir(`${process.cwd()}/commands/`);
    client.commandsNumber = cmdFiles.length;

    var load = args[0];
    const props = require(`${process.cwd()}/commands/${load}`);
    client.log('log', `Loading command: ${props.help.name}.`, 'LOAD');
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 10
};

exports.help = {
    name: 'loadcommand',
    category: 'System',
    description: 'Loads a new command withoud having to restart the bot',
    usage: 'loadcommand [command name]'
};