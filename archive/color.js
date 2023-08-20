const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Placeholder'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('myModal')
            .setTitle('My modal');

        // create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
            .setLabel("What's your favorite color?")
            .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder().addComponents(
            favoriteColorInput
        );

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);

        const favoriteColor =
            interaction.fields.getTextInputValue('favoriteColorInput');

        // change the color of the username
    }
};
