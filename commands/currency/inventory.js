const { SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../currency/dbObjects.js');

module.exports = {
    category: 'currency',
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription("Get user's inventory")
        .addUserOption((option) =>
            option.setName('user').setDescription('The user')
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user') ?? interaction.user;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        if (!items.length) {
            return interaction.reply(`**${target.username}** is broqué!`);
        }

        return interaction.reply(
            `${target.tag} currenty has ${items.map(
                (i) => `\n\t- ${i.amount} ${i.item.name}`
            )}`
        );
    }
};
