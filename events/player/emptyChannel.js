const { EmbedBuilder } = require('discord.js');
const { colors } = require('../../utils/config');

module.exports = {
    name: 'emptyChannel',
    async execute(queue) {
        queue.metadata.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.note)
                    .setDescription(
                        'Leaving the stage due to voice chat inactivity. See you later ❣️'
                    )
            ]
        });
    }
};
