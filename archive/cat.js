const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Random cat picture'),
    async execute(interaction) {
        interaction.deferReply();

        const catResult = await request('https://aws.random.cat/meow');
        // parse response data to a JavaScript object
        const { file } = await catResult.body.json();
        interaction.editReply({ files: [file] });
    }
};
