module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'users',
        {
            user_id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            balance: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            }
        },
        {
            // disable automatically created createdAt and updatedAt columns.
            timestamps: false
        }
    );
};
