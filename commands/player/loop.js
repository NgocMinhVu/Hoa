const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const {
    notInVoiceChannel,
    notInSameVoiceChannel
} = require('../../utils/voiceChannelValidator');
const { queueDoesNotExist } = require('../../utils/queueValidator');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Change the looping mode.')
        .addStringOption((option) =>
            option
                .setName('mode')
                .setDescription('Looping mode')
                .setRequired(true)
                .addChoices(
                    { name: 'disabled', value: '0' },
                    { name: 'track', value: '1' },
                    { name: 'queue', value: '2' },
                    { name: 'autoplay', value: '3' }
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        if (await notInVoiceChannel(interaction)) return;
        if (queue && (await notInSameVoiceChannel(interaction, queue))) return;
        if (await queueDoesNotExist(interaction, queue)) return;

        const loopModes = new Map([
            [0, 'disabled'],
            [1, 'track'],
            [2, 'queue'],
            [3, 'autoplay']
        ]);

        const mode = parseInt(interaction.options.getString('mode'));
        const modeString = loopModes.get(mode);

        const currentMode = queue.repeatMode;
        if (mode === currentMode) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.warning)
                        .setDescription(
                            `Hmm... Looks like the loop mode is already \`${modeString}\`.`
                        )
                ]
            });
        }

        queue.setRepeatMode(mode);

        if (queue.repeatMode === 0) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.success)
                        .setDescription(
                            `Changing loop mode to \`${modeString}\`.`
                        )
                ]
            });
        }

        if (queue.repeatMode === 1 || queue.repeatMode === 2) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.success)
                        .setDescription(
                            `Changing loop mode to \`${modeString}\`. The ${modeString} will now play on repeat!`
                        )
                ]
            });
        }

        if (queue.repeatMode === 3) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.success)
                        .setDescription(
                            `Changing loop mode to \`${modeString}\`. When the queue is empty, similar tracks will start playing!`
                        )
                ]
            });
        }
    }
};
