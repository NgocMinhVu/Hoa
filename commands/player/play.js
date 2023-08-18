const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');

module.exports = {
    category: 'player',
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

        if (queue) {
            if (await notInSameVoiceChannel(interaction, queue)) return;
        }

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

            return interaction.editReply(`**${track.title}** enqueued!`);
        } catch (e) {
            return interaction.editReply(`Something went wrong: ${e}`);
        }
    }
};
