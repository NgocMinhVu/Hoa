const fs = require('node:fs');
const path = require('node:path');
// `Collection` class extends JavaScript's native `Map` class.
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require('discord.js');
const { Player } = require('discord-player');
const {
    SpotifyExtractor,
    SoundCloudExtractor
} = require('@discord-player/extractor');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    allowedMentions: {
        parse: ['users', 'roles'],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction]
    }
});
// store client as a global variable
global.client = client;
// manage command cooldowns
client.cooldowns = new Collection();
// register command objects
client.commands = new Collection();

// registering events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// registering commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// entrypoint for discord-player based application
const player = Player.singleton(client);
// load extractors from the @discord-player/extractor package
player.extractors.register(SoundCloudExtractor, {});
player.extractors.register(SpotifyExtractor, {});

player.on('trackStart', (queue, track) => {
    queue.metadata.send(
        `Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
    );
});

player.on('trackAdd', (queue, track) => {
    queue.metadata.send(`Track **${track.title}** queued!`);
});

player.on('botDisconnect', (queue) => {
    queue.metadata.send(
        'I was manually disconnected from the voice channel, clearing queue!'
    );
});

player.on('channelEmpty', (queue) => {
    queue.metadata.send('Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', (queue) => {
    queue.metadata.send('Queue finished!');
});

client.login(token);
