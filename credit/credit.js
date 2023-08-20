const { Collection } = require('discord.js');
const { Users } = require('../dbObjects.js');

const credit = new Collection();

async function addBalance(id, amount) {
    const user = credit.get(id);

    if (user) {
        user.balance += Number(amount);
        return user.save();
    }

    const newUser = await Users.create({ user_id: id, balance: amount });
    credit.set(id, newUser);

    return newUser;
}

function getBalance(id) {
    const user = credit.get(id);
    return user ? user.balance : 0;
}

module.exports = {
    credit,
    addBalance,
    getBalance
};
