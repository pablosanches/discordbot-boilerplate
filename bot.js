const Discord = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');

const client = new Discord.Client();

try {
    client.config = require('./config.js');
} catch (err) {
    console.error('Unable to load config.js\n', err);
    process.exit(1);
}

if (client.config.debug) {
    console.warn('RUNNING IN DEBUG MODE. SOME PRIVATE INFORMATION (SUCH AS THE TOKEN) MAY BE LOGGED TO CONSOLE');
	client.on('error', (e) => console.log(e));
	client.on('warn', (e) => console.log(e));
	client.on('debug', (e) => console.log(e));
}

var allowedStatus = ['online', 'idle', 'invisible', 'dnd'];
if (!allowedStatus.includes(client.config.status)) {
    console.error(`Bot status must be one of ${allowedStatus.join('/')}`);
    process.exit(1);
}

require('./modules/functions.js')(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.settings = new Enmap({ name: 'settings' });
client.tags = new Enmap({ name: 'tags' });
client.talkedRecently = new Set();

const init = async () => {
    const cmdFiles = await readdir('./commands/');
    client.commandsNumber = cmdFiles.length;
    client.log('log', `Loading a total of ${client.commandsNumber} commands.`, 'LOAD');

    cmdFiles.forEach(file => {
        try {
            const props = require(`./commands/${file}`);
            if (file.split('.').slice(-1)[0] !== 'js') return;

            client.log('log', `Loading Command: ${props.help.name}.`, 'LOAD');
			client.commands.set(props.help.name, props);

            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, prop.help.name);
            });
        } catch (e) {
            client.log('ERROR', `Unable to load command ${file}: ${e}`);
        }
    });

    const eventsFiles = await readdir('./events/');
    client.log('log', `Loading a total of ${eventsFiles.length} events.`, 'LOAD');
	eventsFiles.forEach(file => {
		const eventName = file.split('.')[0];
		client.log('log', `Loading Event: ${eventName}.`, 'LOAD');
		const event = require(`./events/${file}`);
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});

    var token = client.config.token;

	process.on('unhandledRejection', err => {
		if (err.code === 'ENOTFOUND' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
			client.log('ERROR', `Bot connection error: ${err.code}`);
		} else {
			client.log('ERROR', `Uncaught Promise Error: \n${err.stack}`);
		}
	});

	client.login(token);
};

init();