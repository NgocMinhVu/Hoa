const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');
const { colors } = require('../../utils/config.js');

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
                    // node Options are the options for guild node (queue)
                    metadata: interaction // access this metadata object using queue.metadata later on
                }
            });

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.success)
                        .setDescription(`Upcoming: **${track.title}**`)
                ]
            });
        } catch (e) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.error)
                        .setDescription(`Something went wrong: ${e}`)
                ]
            });
        }
    }
};
