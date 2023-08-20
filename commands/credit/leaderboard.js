const { SlashCommandBuilder, codeBlock, EmbedBuilder } = require('discord.js');
const { credit } = require('../../credit/credit.js');
const { colors } = require('../../utils/config.js');

module.exports = {
    category: 'credit',
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('The leaderboard.'),
    async execute(interaction) {
        await interaction.deferReply();

        const rankString =
            credit
                // sort in descending order based on the balance property
                .sort((a, b) => b.balance - a.balance)
                // include only users whose user_id is present in the client users cache
                .filter((user) => client.users.cache.has(user.user_id))
                // select the first 10
                .first(10)
                // position is the index of the user in the array, starting from 0
                .map(
                    (user, position) =>
                        `${position + 1}. \u200B \u200B **${
                            client.users.cache.get(user.user_id).username
                        }** \u200B \u200B - \u200B \u200B ${user.balance}`
                )
                .join('\n') || '*N/A*';

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colors.info)
                    .setAuthor({
                        name: 'Hoa',
                        iconURL: client.user.avatarURL()
                    })
                    .setTitle('Leaderboard')
                    .setFields(
                        {
                            name: 'Guild',
                            value: interaction.guild.name,
                            inline: true
                        },
                        { name: '\u200B', value: '\u200B', inline: true },
                        {
                            name: 'Member Count',
                            value: `${interaction.guild.memberCount}`,
                            inline: true
                        },
                        { name: '\u200B', value: rankString }
                    )
            ]
        });
    }
};
