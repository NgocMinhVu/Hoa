const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../tags.js');
const tag = require('./tag.js');

module.exports = {
    category: 'tag',
    data: new SlashCommandBuilder()
        .setName('taglist')
        .setDescription('Retrieve the list of available tags.'),
    async execute(interaction) {
        // SELECT name FROM tags;
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString =
            tagList.map((t) => `\`${t.name}\``).join('\n\t') || 'No tags set.';

        return interaction.reply(`List of tags: \n\t${tagString}`);
    }
};
