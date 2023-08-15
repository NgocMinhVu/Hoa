const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

const trim = (str, max) =>
    str.length > max ? `${str.slice(0, max - 3)}...` : str;

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Search ubran dictionary')
        .addStringOption((option) =>
            option.setName('term').setDescription('The term').setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const term = interaction.options.getString('term');
        const query = new URLSearchParams({ term });

        const dictResult = await request(
            `https://api.urbandictionary.com/v0/define?${query}`
        );
        const { list } = await dictResult.body.json();

        if (!list.length) {
            return interaction.editReply(`No results found for **${term}**.`);
        }

        const [answer] = list;

        const embed = new EmbedBuilder()
            .setColor(0xf8c8dc)
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addFields(
                {
                    name: 'Definition',
                    value: trim(answer.definition.replace(/\[|\]/g, ''), 1024)
                },
                {
                    name: 'Example',
                    value: trim(answer.example.replace(/\[|\]/g, ''), 1024)
                },
                {
                    name: 'Rating',
                    value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`
                }
            );

        interaction.editReply({ embeds: [embed] });
    }
};
