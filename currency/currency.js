const { Collection } = require('discord.js');
const { Users } = require('./dbObjects.js');

const currency = new Collection();

async function addBalance(id, amount) {
    const user = currency.get(id);

    if (user) {
        user.balance += Number(amount);
        return user.save();
    }

    const newUser = await Users.create({ user_id: id, balance: amount });
    currency.set(id, newUser);

    return newUser;
}

function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
}

module.exports = {
    currency,
    addBalance,
    getBalance
};
