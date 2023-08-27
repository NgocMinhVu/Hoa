const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../utils/config');

module.exports = {
    name: 'emptyQueue',
    async execute(queue) {
        queue.metadata.send({
            embeds: [
                new EmbedBuilder()
                    .setColors(colors.note)
                    .setDescription("And that's a wrap! Queue finished.")
            ]
        });
    }
};
