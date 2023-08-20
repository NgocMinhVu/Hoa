// only need to run this file once, unless making a change to the models.

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/Emoticons.js')(sequelize, Sequelize.DataTypes);

// process.argv array contains the command line arguments.
// if force is true, the database synchronization should drop and recreate tables.
const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize
    .sync({ force })
    .then(async () => {
        console.log('Database synced.');

        // close the database connection
        sequelize.close();
    })
    .catch(console.error);
