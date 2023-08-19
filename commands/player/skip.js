const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator');
const {
    queueDoesNotExist,
    queueNoCurrentTrack
} = require('../../utils/queueValidator');
const { colors } = require('../../utils/config.js');
const { skipTrack } = require('./response.json');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song.'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (await queueDoesNotExist(interaction, queue)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;
        if (await queueNoCurrentTrack(interaction, queue)) return;

        const skippedTrack = queue.currentTrack;
        queue.node.skip();

        const response =
            skipTrack[Math.floor(Math.random() * skipTrack.length)];

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.success)
                    .setDescription(`${response}`)
            ]
        });
    }
};
