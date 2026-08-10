// models/index.js
const config = require("../config/config");
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

const Speciality = require("./Speciality");
const SpecialityDirectField = require("./SpecialityDirectField");

Speciality.init(sequelize);
SpecialityDirectField.init(sequelize);

// 3. db 객체에 할당
db.Speciality = Speciality;
db.SpecialityDirectField = SpecialityDirectField;

// 4. 모델 간의 관계 설정 (JOIN을 위해 필수)
db.Speciality.hasMany(db.SpecialityDirectField, {
    foreignKey: 'specialty_id',
    as: 'directFields'
});

db.SpecialityDirectField.belongsTo(db.Speciality, {
    foreignKey: 'specialty_id'
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize.sync()
    .then(() => console.log("Synchronized"))
    .catch((err) => console.error("Sync Error: ", err));

module.exports = db;