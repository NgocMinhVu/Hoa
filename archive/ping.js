const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        await wait(1000);
        await interaction.editReply({
            content: "If this keeps up, I'm...",
            ephemeral: true
        });
        await wait(3000);
        await interaction.editReply({
            content: "I'm not dead yet!",
            ephemeral: true
        });
        await wait(1000);
        await interaction.followUp({ content: 'Yee-haw!' });
        await interaction.deleteReply();
    }
};
