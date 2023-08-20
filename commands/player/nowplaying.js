const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');
const {
    queueDoesNotExist,
    queueNoCurrentTrack
} = require('../../utils/queueValidator.js');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Get information about the currently playing track.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (await queueNoCurrentTrack(interaction, queue)) return;

        const sourceString = new Map([
            ['youtube', 'YouTube'],
            ['soundcloud', 'SoundCloud'],
            ['spotify', 'Spotify'],
            ['apple_music', 'Apple Music'],
            ['arbitrary', 'Direct source']
        ]);

        const currentTrack = queue.currentTrack;

        let author = currentTrack.author ? currentTrack.author : '*N/A*';

        const source = sourceString.get(currentTrack.raw.source) ?? '*N/A*';

        const loopModes = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);
        const loopMode = loopModes.get(queue.repeatMode);

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.info)
                    .setTitle(`Now Playing`)
                    .setAuthor({
                        name: `Hoa`,
                        iconURL: client.user.avatarURL()
                    })
                    .setThumbnail(currentTrack.thumbnail)
                    .setDescription(
                        `💿 [${currentTrack.title}](${currentTrack.url})`
                    )
                    .setFields(
                        { name: 'Author', value: author, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        {
                            name: 'Track Length',
                            value: currentTrack.duration,
                            inline: true
                        },
                        {
                            name: 'Source',
                            value: source,
                            inline: true
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        {
                            name: 'Requested by',
                            value: currentTrack.raw.requestedBy.username,
                            inline: true
                        },
                        {
                            name: 'Channel',
                            value: queue.channel.name,
                            inline: true
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        {
                            name: 'Loop Mode',
                            value: `\`${loopMode}\``,
                            inline: true
                        }
                    )
            ]
        });
    }
};
