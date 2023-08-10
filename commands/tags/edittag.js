const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../tags.js');

module.exports = {
    category: 'tags',
    data: new SlashCommandBuilder()
        .setName('edittag')
        .setDescription('Edit a tag.')
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

        // UPDATE tags (description) values (?) WHERE name = '?';
        // .update() function returns the number of rows that the where condition changed
        const affectedRows = await Tags.update(
            { description: tagDescription },
            { where: { name: tagName } }
        );

        if (affectedRows > 0) {
            return interaction.reply(`Tag \`${tagName}\` was edited.`);
        }

        return interaction.reply(
            `Could not find a tag with name \`${tagName}\`.`
        );
    }
};
