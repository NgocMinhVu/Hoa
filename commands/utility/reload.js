const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true);
        const command = client.commands.get(commandName);

        if (!command) {
            return interaction.reply(
                `There is no command with name \`${commandName}\`!`
            );
        }

        // get name of command file
        const commandFile = commandName.toLowerCase().replace(/\s/g, '');

        delete require.cache[
            require.resolve(`../${command.category}/${commandFile}.js`)
        ];

        try {
            client.commands.delete(command.data.name);
            const newCommand = require(`../${command.category}/${commandFile}.js`);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(
                `Command \`${newCommand.data.name}\` was reloaded!`
            );
        } catch (error) {
            console.error(error);
            await interaction.reply(
                `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
            );
        }
    }
};
