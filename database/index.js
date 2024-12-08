const {Sequelize} = require('sequelize');
const dbConfig = require("../config/").db;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

const modelDefiners = [
    require('./models/user.model'),
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

module.exports = sequelize;
