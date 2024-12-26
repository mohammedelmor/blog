function applyExtraSetup(sequelize) {
    const { User, RefreshToken, Post, Comment } = sequelize.models;

    User.hasMany(RefreshToken, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    })
    RefreshToken.belongsTo(User, {
        foreignKey: 'user_id',
    })

    User.hasMany(Post, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    })
    Post.belongsTo(User, {
        foreignKey: 'user_id',
    })

    User.hasMany(Comment, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    })
    Comment.belongsTo(User, {
        foreignKey: 'user_id',
    })

    Post.hasMany(Comment, {
        foreignKey: 'post_id',
        onDelete: 'CASCADE',
    })
    Comment.belongsTo(Post, {
        foreignKey: 'post_id',
    })
}

module.exports = { applyExtraSetup };