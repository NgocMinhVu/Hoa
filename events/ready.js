const { Events } = require('discord.js');
const { Tags } = require('./../tags.js');
const { Users } = require('./../dbObjects.js');
const { currency } = require('./../currency.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        Tags.sync();

        // sync the currency collection with the database for easy access later
        const storedBalance = await Users.findAll();
        storedBalance.forEach((b) => currency.set(b.user_id, b));

        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};
