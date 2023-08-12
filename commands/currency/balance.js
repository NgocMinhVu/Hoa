const { SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../../currency.js');

module.exports = {
    category: 'currency',
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Get user's balance")
        .addUserOption((option) =>
            option.setName('user').setDescription('The user')
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user') ?? interaction.user;

        return interaction.reply(
            `**${target.username}** has **${getBalance(target.id)}💰**.`
        );
    }
};
