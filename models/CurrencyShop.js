module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'currency_shop',
        {
            name: {
                // sequelize automatically generates the primary key if it is not set.
                type: DataTypes.STRING,
                unique: true
            },
            cost: {
                types: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            timestamps: false
        }
    );
};
