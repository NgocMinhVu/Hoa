const {
    SelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ComponentType
} = require('discord.js');

module.exports = {
    category: 'fun',
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
                    .setEmoji('🌱'),
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
            )
            .setMinValues(1)
            .setMaxValues(1);

        const row = new ActionRowBuilder().addComponents(select);

        const response = await interaction.reply({
            content: 'Choose your starter!',
            components: [row]
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            max: 1,
            time: 30000
        });

        collector.on('collect', async (i) => {
            if (i.user.id === interaction.user.id) {
                const selection = i.values[0];
                const capitalizedSelection =
                    selection.charAt(0).toUpperCase() + selection.slice(1);
                await i.reply(
                    `${i.user} has selected ${capitalizedSelection}!`
                );
            } else {
                await i.reply({
                    content: 'Please wait for your turn.',
                    ephemeral: true
                });
            }
        });

        collector.on('end', (collected) =>
            console.log(`Collected ${collected.size} items`)
        );
    }
};
