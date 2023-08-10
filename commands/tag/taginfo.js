const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../tags.js');

module.exports = {
    category: 'tag',
    data: new SlashCommandBuilder()
        .setName('taginfo')
        .setDescription('Retrieve tag details')
        .addStringOption((option) =>
            option.setName('name').setDescription('Tag name').setRequired(true)
        ),
    async execute(interaction) {
        const tagName = interaction.options.getString('name');

        // SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });

        if (tag) {
            return interaction.reply(
                `\`${tagName}\` was created by **${tag.username}** at **${tag.createdAt}** and has been used **${tag.usage_count}** times.`
            );
        }

        return interaction.reply(`Could not find tag: \`${tagName}\``);
    }
};
