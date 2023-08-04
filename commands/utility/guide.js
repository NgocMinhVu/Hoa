const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('Search discordjs.guide!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('query')
                .setDescription('Phrase to search for')
                .addStringOption((option) =>
                    option
                        .setName('phrase')
                        .setDescription('The phrase')
                        .setAutocomplete(true)
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('version')
                        .setDescription('Version to search in')
                        .addStringOption((option) =>
                            option
                                .setName('discord_version')
                                .setDescription('Discord version')
                                .setAutocomplete(true)
                        )
                )
        ),
    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (focusedOption.name === 'query') {
            choices = [
                'Popular Topics: Threads',
                'Sharding: Getting started',
                'Library: Voice Connections',
                'Interactions: Replying to slash commands',
                'Popular Topics: Embed preview'
            ];
        }

        if (focusedOption.name === 'version') {
            choices = ['v9', 'v11', 'v12', 'v13', 'v14'];
        }

        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedOption.value)
        );
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        );
    },
    async execute(interaction) {
        // INCOMPLETE
        const queryOption = interaction.options.getString('query');
        console.log(queryOption);
        const versionOption = interaction.options.getString('version');
        console.log(versionOption);

        let selectedOption;

        if (!selectedOption) {
            await interaction.reply('You did not select any option');
        }

        await interaction.reply(`You selected: ${selectedOption}`);
    }
};
