const { EmbedBuilder } = require('discord.js');
const { colors } = require('./config.js');

async function queueDoesNotExist(interaction, queue) {
    if (!queue) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.warning)
                    .setDescription(
                        'Uh-oh! The queue is empty right now. You can add more tracks with `/play`.'
                    )
            ]
        });

        return true;
    }
    return false;
}

async function queueIsEmpty(interaction, queue) {
    if (queue.tracks.data.length === 0) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.warning)
                    .setDescription(
                        'Uh-oh! The queue is empty right now. You can add more tracks with `/play`.'
                    )
            ]
        });

        return true;
    }
    return false;
}

async function queueNoCurrentTrack(interaction, queue) {
    if (!queue.currentTrack) {
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.warning)
                    .setDescription(
                        'Uh-oh! Nothing is playing right now. You can add more tracks with `/play`.'
                    )
            ]
        });

        return true;
    }
    return false;
}

module.exports = { queueDoesNotExist, queueIsEmpty, queueNoCurrentTrack };
