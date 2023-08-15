const { SlashCommandBuilder } = require('discord.js');
const { Op } = require('sequelize');
const { getBalance, addBalance } = require('../../currency/currency.js');
const { Users, CurrencyShop } = require('../../currency/dbObjects.js');

module.exports = {
    category: 'currency',
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy an item.')
        .addStringOption((option) =>
            option.setName('item').setDescription('The item').setRequired(true)
        ),
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: itemName } }
        });

        if (!item) return interaction.reply(`That item doesn't exit.`);
        if (item.cost > getBalance(interaction.user.id)) {
            return interaction.reply(
                `You currently have **${getBalance(
                    interaction.user.id
                )}, but the **${item.name}** costs **${item.cost}**!`
            );
        }

        const user = await Users.findOne({
            where: { user_id: interaction.user.id }
        });
        addBalance(interaction.user.id, -item.cost);
        await user.addItem(item);

        return interaction.reply(`You've bought: **${item.name}**.`);
    }
};
