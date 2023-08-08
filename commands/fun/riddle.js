const { SlashCommandBuilder } = require('discord.js');
const riddle = require('./riddle.json');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('riddle')
        .setDescription('Riddle me this!'),
    async execute(interaction) {
        const item = riddle[Math.floor(Math.random() * riddle.length)];

        const collectorFilter = (response) => {
            return item.answers.some(
                (answer) =>
                    answer.toLowerCase() === response.content.toLowerCase()
            );
        };

        interaction
            .reply({ content: item.question, fetchReply: true })
            .then(() => {
                interaction.channel
                    .awaitMessages({
                        filter: collectorFilter,
                        max: 1,
                        time: 30000,
                        errors: ['time'] // if the time limit is exceeded, an error will be triggered.
                    })
                    .then((collected) => {
                        interaction.followUp(
                            `${
                                collected.first().author
                            } got the correct answer!`
                        );
                    })
                    .catch((collected) => {
                        console.log(collected);
                        interaction.followUp(
                            'Looks like nobody got the answer this time.'
                        );
                    });
            });
    }
};
