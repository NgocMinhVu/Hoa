const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator');
const {
    queueDoesNotExist,
    queueIsEmpty,
    queueNoCurrentTrack
} = require('../../utils/queueValidator');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;
        if (await queueNoCurrentTrack(interaction, queue)) return;

        const skippedTrack = queue.currentTrack;
        queue.node.skip();

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.success)
                    .setAuthor({
                        name:
                            interaction.member.nickname ||
                            interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(
                        `**${skippedTrack.title}** has been skipped.`
                    )
            ]
        });
    }
};
