const fs = require('node:fs');
const path = require('node:path');
// `Collection` class extends JavaScript's native `Map` class.
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require('discord.js');
const { Player, GuildQueue, GuildNodeManager } = require('discord-player');
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

// registering client events
const clientEventsPath = path.join(__dirname, 'events/client');
const clientEventFiles = fs
    .readdirSync(clientEventsPath)
    .filter((file) => file.endsWith('.js'));

for (const file of clientEventFiles) {
    const filePath = path.join(clientEventsPath, file);
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

const guildNodeManager = new GuildNodeManager(player);
global.guildNodeManager = guildNodeManager;

// registering player events
const playerEventsPath = path.join(__dirname, 'events/player');
const playerEventFiles = fs
    .readdirSync(playerEventsPath)
    .filter((file) => file.endsWith('.js'));

for (const file of playerEventFiles) {
    const filePath = path.join(playerEventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);
