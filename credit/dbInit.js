// only need to run this file once, unless making a change to the models.

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

require('../models/Users.js')(sequelize, Sequelize.DataTypes);
// require('../models/UserItems.js')(sequelize, Sequelize.DataTypes);
// const CurrencyShop = require('../models/CurrencyShop.js')(
//     sequelize,
//     Sequelize.DataTypes
// );

// process.argv array contains the command line arguments.
// if force is true, the database synchronization should drop and recreate tables.
const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize
    .sync({ force })
    .then(async () => {
        // const shop = [
        //     upsert is a portmanteau for update or insert.
        //     CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
        //     CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
        //     CurrencyShop.upsert({ name: 'Cake', cost: 5 })
        // ];

        // Promise.all() takes an iterable of promises and returns a single Promise.
        // await Promise.all(shop);
        // console.log('Database synced');

        // close the database connection
        sequelize.close();
    })
    .catch(console.error);
