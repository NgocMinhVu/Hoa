module.exports = (sequelize, DataTypes) => {
    return sequelize.define('emoticons', {
        // name VARCHAR(255) UNIQUE
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        // description TEXT NOT NULL
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // username VARCHAR(255)
        username: DataTypes.STRING,
        // usage_count INT NOT NULL DEFAULT 0
        usage_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    });
};
