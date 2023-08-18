const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// grab all the command files from the commands directory created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // grab all the command files from the commands directory created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));
    // grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

const global = process.argv.includes('--global') || process.argv.includes('-g');

// construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// deploy commands
(async () => {
    try {
        if (global) {
            console.log(
                `Started refreshing ${commands.length} global application (/) commands.`
            );

            const data = await rest.put(
                Routes.applicationCommands(clientId, guildId),
                { body: commands }
            );

            console.log(
                `Successfully reloaded ${data.length} global application (/) commands.`
            );
        } else {
            console.log(
                `Started refreshing ${commands.length} guild application (/) commands.`
            );

            // the put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            );

            console.log(
                `Successfully reloaded ${data.length} guild application (/) commands.`
            );
        }
    } catch (error) {
        console.error(error);
    }
})();
