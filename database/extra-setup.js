function applyExtraSetup(sequelize) {
    const { User, RefreshToken } = sequelize.models;

    User.hasMany(RefreshToken, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    });
    RefreshToken.belongsTo(User, {
        foreignKey: 'user_id',
    });
}

module.exports = { applyExtraSetup };