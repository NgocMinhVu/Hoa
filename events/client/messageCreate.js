const { Events } = require('discord.js');
const { addBalance } = require('../../credit/currency.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        return;
    }
};
