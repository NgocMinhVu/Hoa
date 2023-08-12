const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../tags.js');

module.exports = {
    category: 'tag',
    data: new SlashCommandBuilder()
        .setName('deletetag')
        .setDescription('Delete a tag.')
        .addStringOption((option) =>
            option.setName('name').setDescription('Tag name').setRequired(true)
        ),
    async execute(interaction) {
        const tagName = interaction.options.getString('name');

        // DELETE from tags WHERE name = ?;
        // .destroy() returns the number of affected rows.
        const rowCount = await Tags.destroy({ where: { name: tagName } });

        if (!rowCount) return interaction.reply("That tag doesn't exist.");

        return interaction.reply('Tag deleted.');
    }
};
