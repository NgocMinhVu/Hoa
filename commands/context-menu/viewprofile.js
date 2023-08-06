const {
    ContextMenuCommandBuilder,
    ApplicationCommandType
} = require('discord.js');

module.exports = {
    category: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('View Profile')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const { username } = interaction.targetUser;
        await interaction.reply(`Username: ${username}`);
    }
};
