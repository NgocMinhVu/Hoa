const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption((option) =>
            option
                .setName('target')
                .setDescription('The member to kick')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('The reason for banning')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason =
            interaction.options.getString('reason') || 'No reason provided';

        await interaction.reply(
            `Kicking ${target.username} for reason: ${reason}`
        );
        await target.kick();
    }
};
