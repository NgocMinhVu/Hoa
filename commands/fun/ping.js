const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	category: 'fun',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({ content: 'Hee!', ephemeral: true });
		await wait(2000);
		await interaction.editReply({
			content: 'Haw!',
			ephemeral: true,
		});
	},
};
