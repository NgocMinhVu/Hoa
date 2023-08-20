const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBalance, addBalance } = require('../../credit/credit.js');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'credit',
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer credits to a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user').setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('The amount')
                .setMinValue(1)
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const currentAmount = getBalance(interaction.user.id);
        const transferTarget = interaction.options.getUser('user');
        const transferAmount = interaction.options.getInteger('amount');

        if (transferAmount > currentAmount) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.warning)
                        .setDescription(
                            `Oops! Looks like you don't have enough credits for that.`
                        )
                ]
            });
        }

        addBalance(interaction.user.id, -transferAmount);
        addBalance(transferTarget.id, transferAmount);

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.success)
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `Ting-a-ling! Successfully transferred **${transferAmount}** credits to **${transferTarget.username}**.`
                    )
            ]
        });
    }
};
