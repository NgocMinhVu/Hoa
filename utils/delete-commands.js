const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config.json');

const commandId = '';

const global = process.argv.includes('--global') || process.argv.includes('-g');

const rest = new REST().setToken(token);

if (global) {
    // for global commands
    rest.delete(Routes.applicationCommand(clientId, commandId))
        .then(() => console.log('Successfully deleted application command'))
        .catch(console.error);
} else {
    // for guild-based commands
    rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId))
        .then(() => console.log('Sucessfully deleted guild command'))
        .catch(console.error);
}
