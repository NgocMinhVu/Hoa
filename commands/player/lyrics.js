const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { lyricsExtractor } = require('@discord-player/extractor');
const {
    queueDoesNotExist,
    queueNoCurrentTrack
} = require('../../utils/queueValidator.js');
const { colors } = require('../../utils/config.js');
const { noLyrics } = require('./response.json');
const { geniusClientId } = require('../../config.json');

module.exports = {
    category: 'player',
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Retrieve the lyrics for a track from Genius.')
        .addStringOption((option) =>
            option.setName('query').setDescription('Search query or URL')
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);

        let searchQuery = interaction.options.getString('query');

        // if query is not specified, retrieve lyrics for the current track
        if (!searchQuery) {
            if (await queueDoesNotExist(interaction, queue)) return;
            if (await queueNoCurrentTrack(interaction, queue)) return;
            searchQuery = queue.currentTrack.title;
        }

        const genius = lyricsExtractor(geniusClientId);

        let lyricsResult = await genius.search(searchQuery).catch(() => null);

        console.log(lyricsResult);

        // try again with shorter query
        if (!lyricsResult && searchQuery.length > 20) {
            lyricsResult = await genius
                .search(searchQuery.slice(0, 20))
                .catch(() => null);
        }
        if (!lyricsResult && searchQuery.length > 10) {
            lyricsResult = await genius
                .search(searchQuery.slice(0, 10))
                .catch(() => null);
        }

        // if no lyrics is found
        if (!lyricsResult || !lyricsResult.lyrics) {
            const response =
                noLyrics[Math.floor(Math.random() * noLyrics.length)];
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(colors.warning)
                        .setDescription(response)
                        .setFields({
                            name: 'query',
                            value: `${searchQuery}`
                        })
                ]
            });
        }

        const embedCount = Math.ceil(lyricsResult.lyrics.length / 3800);
        const embeds = new Array();
        for (let i = 0; i < embedCount; i++) {
            const trimmedLyrics = lyricsResult.lyrics.slice(
                i * 3800,
                (i + 1) * 3800
            );
            if (i === 0) {
                embeds.push(
                    new EmbedBuilder()
                        .setColor(colors.note)
                        .setAuthor({
                            name: `${lyricsResult.artist.name}`,
                            iconURL: `${lyricsResult.artist.image}`,
                            url: `${lyricsResult.artist.url}`
                        })
                        .setTitle(`${lyricsResult.title}`)
                        .setURL(`${lyricsResult.url}`)
                        .setThumbnail(`${lyricsResult.thumbnail}`)
                        .setDescription(`${trimmedLyrics}`)
                );
            } else {
                embeds.push(
                    new EmbedBuilder()
                        .setColor(colors.note)
                        .setDescription(`${trimmedLyrics}`)
                );
            }
        }
        return await interaction.editReply({ embeds: embeds });
    }
};
