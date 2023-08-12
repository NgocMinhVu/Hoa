const { SlashCommandBuilder } = require('discord.js');
const { getBalance, addBalance } = require('../../currency.js');

module.exports = {
    category: 'currency',
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer money to a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user').setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('The amount')
                .setRequired(true)
        ),
    async execute(interaction) {
        const currentAmount = getBalance(interaction.user.id);
        const transferTarget = interaction.options.getUser('user');
        const transferAmount = interaction.options.getInteger('amount');

        if (transferAmount > currentAmount) {
            return interaction.reply(
                `Sorry, you only have **${currentAmount}**.`
            );
        }

        if (transferAmount <= 0) {
            return interaction.reply(
                `Please enter an amount greater than zero.`
            );
        }

        addBalance(interaction.user.id, -transferAmount);
        addBalance(transferTarget.id, transferAmount);

        return interaction.reply(
            `Successfully transferred **${transferAmount}💰** to **${transferTarget.username}**.`
        );
    }
};
