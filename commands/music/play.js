const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'music',
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
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply({
                content: 'You are not connected to a voice channel.',
                ephemeral: true
            });
        }

        // TODO: if the bot is already in a channel, check if it is the same channel as the member

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
