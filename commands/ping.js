exports.run = async (client, message, args, level) => {
    const msg = await message.channel.send('Ping?');
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(client.ws.ping)}ms`);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'ping',
    category: 'Miscelaneous',
    description: 'For checking response time',
    usage: 'ping'
}