const config = require("../config/config")
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host: config.development.host,
        dialect: config.development.dialect,
        operatorsAliases: false,
        timezone: '+09:00',
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        },
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.speciality = require("./Speciality")(sequelize, Sequelize);

sequelize.sync()
    .then(() => console.log("Syncronized"))

module.exports = db;