const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song.'),
    async execute(interaction) {
        await interaction.deferReply();

        if (await notInVoiceChannel(interaction)) return;

        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return await interaction.reply(
                'The queue is currently empty. You can add some tracks with `/play`.'
            );
        }

        if (await notInSameVoiceChannel(interaction, queue)) return;

        const player = useMainPlayer();

        const skippedTrack = queue.currentTrack;
        try {
            queue.node.skip();
            return interaction.followUp(
                `Skipped **${skippedTrack.title}**!   `
            );
        } catch {
            return interaction.followUp('Something went wrong!');
        }
    }
};
