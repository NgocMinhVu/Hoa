const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

        const queueLength = queue.tracks.data.length;
        let queueString;
        if (queueLength === 0) {
            queueString = '*No upcoming tracks*';
        } else {
            queueString = queue.tracks.data
                .map((track, index) => {
                    let durationFormat =
                        track.raw.duration === 0 || track.duration === '0:00'
                            ? ''
                            : `\`[${track.duration}]\``;
                    return `${index + 1}. ${track.title} ${durationFormat}`;
                })
                .join('\n');
        }

        const currentTrack = queue.currentTrack;
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
                        .setTimestamp()
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
