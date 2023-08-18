async function notInVoiceChannel(interaction) {
    if (!interaction.member.voice.channel) {
        await interaction.reply({
            content: 'You are not connected to a voice channel.',
            ephemeral: true
        });

        return true;
    }
    return false;
}

async function notInSameVoiceChannel(interaction, queue) {
    if (!queue.dispatcher) {
        return true;
    }

    if (interaction.member.voice.chanel.id !== queue.dispatcher.channel.id) {
        await interaction.reply({
            content: `You need to be in the same voice channel as me to use this command.\n\nVoice channel: \`${queue.dispatcher.channel.name}\``,
            ephemeral: true
        });

        return true;
    }

    return false;
}

module.exports = { notInVoiceChannel, notInSameVoiceChannel };
