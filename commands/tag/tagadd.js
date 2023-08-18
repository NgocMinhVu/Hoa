const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../tag/tags.js');

module.exports = {
    category: 'tag',
    data: new SlashCommandBuilder()
        .setName('tagadd')
        .setDescription('Set a new tag')
        .addStringOption((option) =>
            option.setName('name').setDescription('Tag name').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('description')
                .setDescription('Tag description')
                .setRequired(true)
        ),
    async execute(interaction) {
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');

        try {
            // INSERT INTO tags (name, description, username) value (?, ?, ?);
            const tag = await Tags.create({
                name: tagName,
                description: tagDescription,
                username: interaction.user.username
            });

            return interaction.reply(`Tag \`${tag.name}\` added.`);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply('That tag already exists.');
            }

            return interaction.reply('Something went wrong with adding a tag.');
        }
    }
};
