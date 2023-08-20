const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');
const { colors } = require('../../utils/config.js');
const { error } = require('./response.json');

module.exports = {
    category: 'player',
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Queue a track or playlist.')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Search query or URL')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;

        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        const query = interaction.options.getString('query');

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    repeatMode: 2,
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.client
                    }
                },
                requestedBy: interaction.user
            });

            if (!track.playlist) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colors.success)
                            .setTitle('Added Track')
                            .setThumbnail(track.thumbnail)
                            .setFields(
                                {
                                    name: 'Track',
                                    value: `[${track.title}](${track.url})`,
                                    inline: true
                                },
                                {
                                    name: '\u200B',
                                    value: '\u200B',
                                    inline: true
                                },
                                {
                                    name: 'Track Length',
                                    value: track.raw.duration,
                                    inline: true
                                }
                            )
                    ]
                });
            } else {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(colors.success)
                            .setTitle('Added Playlist')
                            .setThumbnail(track.playlist.thumbnail)
                            .setFields(
                                {
                                    name: 'Playlist',
                                    value: `[${track.playlist.title}](${track.playlist.url})`,
                                    inline: true
                                },
                                {
                                    name: '\u200B',
                                    value: '\u200B',
                                    inline: true
                                },
                                {
                                    name: 'Track Count',
                                    value: `${track.playlist.tracks.length}`,
                                    inline: true
                                }
                            )
                    ]
                });
            }
        } catch (e) {
            const response = error[Math.floor(Math.random() * error.length)];
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.error)
                        .setDescription(response)
                ]
            });
        }
    }
};
