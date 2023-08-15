const { Events } = require('discord.js');
const { Users } = require('./../currency/dbObjects.js');
const { currency } = require('./../currency/currency.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // sync the currency collection with the database for easy access later
        const storedBalance = await Users.findAll();
        storedBalance.forEach((b) => currency.set(b.user_id, b));

        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};
