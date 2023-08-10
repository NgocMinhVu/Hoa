const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite'
});

// param1: table name
// param2: an object that represents the table's schema in key-value pairs
const Tags = sequelize.define('tags', {
    // name VARCHAR(255) UNIQUE
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    // description TEXT
    description: Sequelize.TEXT,
    // username VARCHAR(255)
    username: Sequelize.STRING,
    // usage_count INT NOT NULL DEFAULT 0
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

exports.Tags = Tags;
