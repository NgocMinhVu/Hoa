const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { CurrencyShop } = require('../../dbObjects.js');

module.exports = {
    category: 'currency',
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Available items in the shop.'),
    async execute(interaction) {
        const items = await CurrencyShop.findAll();
        return interaction.reply(
            codeBlock(items.map((i) => `${i.name}: ${i.cost}💰`).join(`\n`))
        );
    }
};
