const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');
const {
    queueDoesNotExist,
    queueIsEmpty
} = require('../../utils/queueValidator.js');
const { colors } = require('../../utils/config.js');
const { shuffleQueue } = require('./response.json');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (await queueIsEmpty(interaction, queue)) return;

        queue.tracks.shuffle();

        response =
            shuffleQueue[Math.floor(Math.random() * shuffleQueue.length)];

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.success)
                    .setDescription(response)
            ]
        });
    }
};
