// REST object interacts with the Discord API through HTTP requests.
// Routes object provides methods for generating API routes.
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

// token to be used for authentication
const rest = new REST().setToken(token);

const global = process.argv.includes('--global') || process.argv.includes('-g');

if (global) {
    // for global commands
    rest.put(Routes.applicationCommands(clientId), { body: [] })
        .then(() => console.log('Successfully deleted all global commands.'))
        .catch(console.error);
} else {
    // for guild-based commands
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
        .then(() => console.log('Successfully deleted all guild commands.'))
        .catch(console.error);
}
