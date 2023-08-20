const { Events } = require('discord.js');
const { Users } = require('../../dbObjects.js');
const { credit } = require('../../credit/credit.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // sync the currency collection with the database for easy access later
        const storedBalance = await Users.findAll();
        storedBalance.forEach((b) => credit.set(b.user_id, b));

        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};
