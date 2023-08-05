const {
    SelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Pick your starter Pokémon!'),
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bulbasaur')
                    .setDescription('The dual-type Grass/Poison Seed Pokémon.')
                    .setValue('bulbasaur')
                    .setEmoji('🌱')
                    .setDefault(true),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Charmander')
                    .setDescription('The Fire-type Lizard Pokémon.')
                    .setValue('charmander')
                    .setEmoji('🔥'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Squirtle')
                    .setDescription('The Water-type Tiny Turtle Pokémon.')
                    .setValue('squirtle')
                    .setEmoji('💧')
            );

        const row = new ActionRowBuilder().addComponents(select);

        await interaction.reply({
            content: 'Choose your starter!',
            components: [row]
        });
    }
};
