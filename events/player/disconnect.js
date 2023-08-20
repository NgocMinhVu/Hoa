const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../utils/config');

module.exports = {
    name: 'disconnect',
    async execute(queue) {
        queue.metadate.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.note)
                    .setDescription(
                        "My work here is done. I'm off to the digital sunset."
                    )
            ]
        });
    }
};
