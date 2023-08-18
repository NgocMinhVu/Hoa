const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');
const { useQueue } = require('discord-player');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Get a list of the full queue.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.editReply(
                'The queue is currently empty. You can add some tracks with `/play`.'
            );
        }

        const queueString = queue.tracks.data
            .slice(0, 10)
            .map((track, index) => {
                let durationFormat =
                    track.raw.duration === 0 || track.duration === '0:00'
                        ? ''
                        : `\`${track.duration}\``;
                return `${index + 1}. ${track.title} [${durationFormat}]`;
            })
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Music Queue')
            .setDescription(`${queueString}`);

        return interaction.editReply({ embeds: [embed] });
    }
};
