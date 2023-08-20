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
const { pauseTrack } = require('./response.json');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current session.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (await queueNoCurrentTrack(interaction, queue)) return;

        if (queue.node.isPaused()) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.warning)
                        .setDescription(
                            'Hmm... Looks like the session is already paused.'
                        )
                ]
            });
        } else {
            queue.node.setPaused(true);

            const response =
                pauseTrack[Math.floor(Math.random() * pauseTrack.length)];

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.success)
                        .setDescription(`⏸️ \u200B \u200B ${response}`)
                ]
            });
        }
    }
};
