const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator');
const { queueDoesNotExist } = require('../../utils/queueValidator');
const { colors } = require('../../utils/config.js');
const { removeTrack } = require('./response.json');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a track from the queue.')
        .addNumberOption((option) =>
            option
                .setName('tracknumber')
                .setDescription('Track number to remove from the queue')
                .setMinValue(1)
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;

        const removeTrackNumber = interaction.options.getNumber('tracknumber');

        if (removeTrackNumber > queue.tracks.data.length) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.warning)
                        .setDescription(
                            `Oh dear, \`${removeTrackNumber}\` is not a valid track number. There are only a total of \`${queue.tracks.data.length}\` tracks in the queue right now.`
                        )
                ]
            });
        }

        queue.node.remove(removeTrackNumber - 1);

        const response =
            removeTrack[Math.floor(Math.random() * removeTrack.length)];

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.success)
                    .setDescription(response)
            ]
        });
    }
};
