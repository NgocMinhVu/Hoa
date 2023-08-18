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
        .setDescription('Play music')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('The title or URL of the track')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        if (await notInVoiceChannel(interaction)) return;

        const queue = useQueue(interaction.guild.id);

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
                        .setAuthor({
                            name:
                                interaction.member.nickname ||
                                interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        })
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
