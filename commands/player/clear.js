const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator');
const { queueDoesNotExist } = require('../../utils/queueValidator');
const { colors } = require('../../utils/config.js');
const { clearQueue } = require('./response.json');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Remove all tracks from the queue.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;

        queue.delete();

        const response =
            clearQueue[Math.floor(Math.random() * clearQueue.length)];

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.success)
                    .setDescription(response)
            ]
        });
    }
};
