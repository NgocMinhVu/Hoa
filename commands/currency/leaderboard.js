const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { currency } = require('../../currency.js');

module.exports = {
    category: 'currency',
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('The leaderboard.'),
    async execute(interaction) {
        return interaction.reply(
            codeBlock(
                currency
                    // sort in descending order based on the balance property
                    .sort((a, b) => b.balance - a.balance)
                    // include only users whose user_id is present in the client users cache
                    .filter((user) => client.users.cache.has(user.user_id))
                    // select the first 10
                    .first(10)
                    // position is the index of the user in the array, starting from 0
                    .map(
                        (user, position) =>
                            `(${position + 1}) ${
                                client.users.cache.get(user.user_id).username
                            }: ${user.balance}💰`
                    )
                    .join('\n')
            )
        );
    }
};
