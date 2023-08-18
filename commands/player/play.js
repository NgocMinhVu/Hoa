const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator.js');

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
        if (notInVoiceChannel) {
            return;
        }

        if (notInSameVoiceChannel) {
            return;
        }

        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
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
