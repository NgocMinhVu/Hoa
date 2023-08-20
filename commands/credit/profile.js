const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBalance } = require('../../credit/credit.js');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'credit',
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription("Retrieve a user's profile.")
        .addUserOption((option) =>
            option.setName('user').setDescription('The user')
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const target = interaction.options.getUser('user') ?? interaction.user;
        const balance = getBalance(target.id);

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.info)
                    .setAuthor({
                        name: target.username,
                        iconURL: target.avatarURL()
                    })
                    .setFields({ name: 'Credits', value: `${balance}` })
            ]
        });
    }
};
