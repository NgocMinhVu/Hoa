const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song.'),
    async execute(interaction) {
        await interaction.deferReply();

        const player = useMainPlayer();
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.followUp('No music is being played');
        }

        const currentTrack = queue.current;
        try {
            queue.skip();
            return interaction.followUp(`Skipped **${currentTrack}**!   `);
        } catch {
            return interaction.followUp('Something went wrong!');
        }
    }
};
