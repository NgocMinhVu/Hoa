const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Placeholder')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply(
                'You are not connected to a voice channel.'
            );
        }

        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    // node Options are the options for guild node (queue)
                    metadata: interaction // access this metadata object using queue.metadata later on
                }
            });

            return interaction.followUp(`**${track.title}** enqueued!`);
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
};
