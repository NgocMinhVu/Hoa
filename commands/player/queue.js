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

        // upcoming tracks
        let queueString = '';
        let durationString = '';

        if (queue.tracks.data.length === 0) {
            queueString = '*No upcoming tracks*';
            durationString = '00:00';
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

            durationString = `${String(hours).padStart(2, '0')}:${String(
                minutes
            ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // loop mode
        const modeStrings = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);
        const modeString = modeStrings.get(queue.repeatMode);

        const currentTrack = queue.currentTrack;

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
                        {
                            name: 'Now Playing',
                            value: currentTrack.title || '*No playing track*'
                        },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Upcoming Tracks', value: queueString },
                        { name: '\u200B', value: '\u200B' },
                        {
                            name: 'Duration',
                            value: durationString,
                            inline: true
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Loop mode', value: modeString, inline: true }
                    )
            ]
        });

        if (!currentTrack) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.info)
                        .setTitle('Music Queue')
                        .setAuthor({
                            name: 'Hoa',
                            iconURL: client.user.avatarURL()
                        })
                        .addFields({
                            name: 'Upcoming tracks',
                            value: `${queueString}`
                        })
                ]
            });
        } else {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.info)
                        .setTitle('Music Queue')
                        .setAuthor({
                            name: 'Hoa',
                            iconURL: client.user.avatarURL()
                        })
                        .addFields(
                            {
                                name: 'Now playing',
                                value: `${currentTrack.title}`
                            },
                            {
                                name: 'Upcoming tracks',
                                value: `${queueString}`
                            }
                        )
                        .setTimestamp()
                ]
            });
        }
    }
};

// let nameString = '';
//                 let durationString = '';

//                 for (const item of track.playlist.tracks) {
//                     nameString += `${item.title.slice(0, 50)}\n`;
//                     durationString += `${item.duration}\n`;
//                 }

//                 return interaction.editReply({
//                     embeds: [
//                         new EmbedBuilder()
//                             .setColor(colors.success)
//                             .setAuthor({
//                                 name:
//                                     interaction.member.nickname ||
//                                     interaction.user.username,
//                                 iconURL: interaction.user.avatarURL()
//                             })
//                             .setTitle('Added Playlist')
//                             .setThumbnail(track.playlist.thumbnail)
//                             .setFields({name: 'Playlist', value: track.playlist.title, url: track.playlist.url}, {name: 'Tracks', value: track.playlist.tracks.length, inline: true}
//                                 {
//                                     name: 'Track',
//                                     value: nameString,
//                                     inline: true
//                                 },
//                                 {
//                                     name: '\u200B',
//                                     value: '\u200B',
//                                     inline: true
//                                 },
//                                 {
//                                     name: 'Length',
//                                     value: durationString,
//                                     inline: true
//                                 }
//                             )
//                     ]
//                 });
