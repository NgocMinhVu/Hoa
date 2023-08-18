async function notInVoiceChannel(interaction) {
    if (!interaction.member.voice.channel) {
        await interaction.followUp('You are not connected to a voice channel.');

        return true;
    }
    return false;
}

async function notInSameVoiceChannel(interaction, queue) {
    // check if application if currently in a channel
    if (!queue.dispatcher) {
        return false;
    }

    if (interaction.member.voice.channel.id !== queue.dispatcher.channel.id) {
        await interaction.followUp(
            `You need to be in the same voice channel as me to use this command.\n\nVoice channel: \`${queue.dispatcher.channel.name}\``
        );

        return true;
    }

    return false;
}

module.exports = { notInVoiceChannel, notInSameVoiceChannel };
