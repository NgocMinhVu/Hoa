const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('The input to echo back')
                .setMaxLength(2000)
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel to echo into')
                .addChannelTypes(ChannelType.GuildText)
        )
        .addBooleanOption((option) =>
            option
                .setName('ephemeral')
                .setDescription('Whether or not the echo should be ephemeral')
        ),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        const channel =
            interaction.options.getChannel('channel') || interaction.channel;
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;

        await channel.send({
            content: input,
            ephemeral: ephemeral
        });
    }
};
