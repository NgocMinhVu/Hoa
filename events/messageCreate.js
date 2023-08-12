const { Events } = require('discord.js');
const { addBalance } = require('../currency');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        addBalance(message.author.id, 1);
    }
};
