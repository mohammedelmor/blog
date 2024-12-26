const {Sequelize} = require('sequelize');
const dbConfig = require("../config/").db;
const { applyExtraSetup } = require('./extra-setup');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

const modelDefiners = [
    require('./models/user.model'),
    require('./models/refresh_token.model'),
    require('./models/post.model'),
    require('./models/comment.model')
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = sequelize;
