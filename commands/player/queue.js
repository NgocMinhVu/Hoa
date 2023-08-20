const {
    SlashCommandBuilder,
    EmbedBuilder,
    DefaultRestOptions
} = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');
const { queueDoesNotExist } = require('../../utils/queueValidator.js');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Get a list of the full queue.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;

        // playing track
        let currentString;
        let currentDurationString;

        const currentTrack = queue.currentTrack;
        if (!currentTrack) {
            currentString = '*No playing track\n';
            currentDurationString = '*N/A*';
        } else {
            currentString = `${currentTrack.title}`;
            currentDurationString = `${currentTrack.duration}`;
        }

        // upcoming tracks
        let queueString = '';
        let playlistDurationString = '';

        const queueLength = queue.tracks.data.length;
        if (queueLength === 0) {
            queueString = '*No upcoming tracks*';
            playlistDurationString = '00:00';
        } else {
            let totalSeconds = 0;

            let index = 1;
            for (const track of queue.tracks.data) {
                queueString += `${index++}. ${track.raw.title}\n`;

                const [minutes, seconds] = track.raw.duration.split(':');
                totalSeconds += parseInt(minutes) * 60 + parseInt(seconds);
            }

            const totalMinutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            playlistDurationString = `${String(hours).padStart(
                2,
                '0'
            )}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
                2,
                '0'
            )}`;
        }

        // loop mode
        const modeStrings = new Map([
            [0, 'Disabled'],
            [1, 'Track'],
            [2, 'Queue'],
            [3, 'Autoplay']
        ]);
        const modeString = modeStrings.get(queue.repeatMode);

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.info)
                    .setTitle('Music Queue')
                    .setAuthor({
                        name: 'Hoa',
                        iconURL: client.user.avatarURL()
                    })
                    .setThumbnail(
                        currentTrack.thumbnail ||
                            queue.tracks.data[0].raw.thumbnail
                    )
                    .setFields(
                        { name: 'Loop Mode', value: modeString },
                        {
                            name: 'Now Playing',
                            value: `💿 ${currentString}`,
                            inline: true
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        {
                            name: 'Length',
                            value: currentDurationString,
                            inline: true
                        },
                        {
                            name: 'Upcoming Playlist',
                            value: queueString
                        },
                        {
                            name: 'Playlist Length',
                            value: playlistDurationString
                        }
                    )
            ]
        });
    }
};
