const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Get a list of the full queue.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;

        if (!queue) {
            return await interaction.editReply(
                'The queue is currently empty. You can add some tracks with `/play`.'
            );
        }

        const queueLength = queue.tracks.data.length;
        if (queueLength === 0) {
            return await interaction.editReply(
                'The queue is currently empty. You can add some tracks with `/play`.'
            );
        }

        const queueString = queue.tracks.data
            .map((track, index) => {
                let durationFormat =
                    track.raw.duration === 0 || track.duration === '0:00'
                        ? ''
                        : `\`[${track.duration}]\``;
                return `${index + 1}.     ${track.title} ${durationFormat}`;
            })
            .join('\n');

        const currentTrack = queue.currentTrack;

        if (!currentTrack) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.info)
                        .setTitle('Music Queue')
                        .setAuthor({ name: 'Hoa' })
                        .setDescription(`Add more tracks with \`/play\`.`)
                        .addFields({
                            name: 'Upcoming tracks',
                            value: `${queueString}`
                        })
                        .setTimestamp()
                ]
            });
        } else {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.info)
                        .setTitle('Music Queue')
                        .setAuthor({ name: 'Hoa' })
                        .addFields({
                            name: 'Now playing',
                            value: `${currentTrack.title}`
                        })
                        .addFields({
                            name: 'Upcoming tracks',
                            value: `${queueString}`
                        })
                        .setTimestamp()
                ]
            });
        }
    }
};
