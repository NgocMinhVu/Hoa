const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../tag/tags.js');

module.exports = {
    category: 'tag',
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Get a tag.')
        .addStringOption((option) =>
            option.setName('name').setDescription('Tag name').setRequired(true)
        ),
    async execute(interaction) {
        const tagName = interaction.options.getString('name');

        // SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });

        if (tag) {
            // UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
            tag.increment('usage_count');

            return interaction.reply(tag.get('description'));
        }

        return interaction.reply(`Could not find tag: \`${tagName}\``);
    }
};
