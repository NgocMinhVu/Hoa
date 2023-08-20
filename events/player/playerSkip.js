const { EmbedBuilder } = require('@discordjs/builders');
const { colors } = require('../../utils/config');

module.exports = {
    name: 'playerSkip',
    async execute(queue, track) {
        queue.metadata.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.error)
                    .setDescription(`Skipping ${track.title} due to an issue.`)
            ]
        });
    }
};
