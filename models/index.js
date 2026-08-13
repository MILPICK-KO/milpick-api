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

const Speciality = require('./Speciality');
const SpecialityDirectField = require('./SpecialityDirectField');
const SpecialityExclusion = require('./SpecialityExclusion');

Speciality.init(sequelize);
SpecialityDirectField.init(sequelize);
SpecialityExclusion.init(sequelize);

const MajorMapping = require('./MajorMapping')(sequelize);
const SpecialityIndirectField = require('./SpecialityIndirectField')(sequelize);
const SpecialityCertification = require('./SpecialityCertification')(sequelize);
const VSpecialtySummary = require('./VSpecialtySummary')(sequelize);

const db = {
    sequelize,
    Sequelize,
    Speciality,
    SpecialityDirectField,
    SpecialityExclusion,
    MajorMapping,
    SpecialityIndirectField,
    SpecialityCertification,
    VSpecialtySummary
};

// 4. 모델 간의 관계 설정 (JOIN을 위해 필수)
Speciality.hasMany(SpecialityDirectField, {
    foreignKey: 'specialty_id',
    as: 'directFields'
});

SpecialityDirectField.belongsTo(Speciality, {
    foreignKey: 'specialty_id'
});

Speciality.hasMany(SpecialityExclusion, {
    foreignKey: 'specialty_id',
    as: 'exclusions'
});

SpecialityExclusion.belongsTo(Speciality, {
    foreignKey: 'specialty_id'
});

Speciality.hasMany(SpecialityIndirectField, {
    foreignKey: 'specialty_id',
    as: 'indirectFields'
});
SpecialityIndirectField.belongsTo(Speciality, {
    foreignKey: 'specialty_id'
});

Speciality.hasMany(SpecialityCertification, {
    foreignKey: 'specialty_id',
    as: 'certifications'
});
SpecialityCertification.belongsTo(Speciality, {
    foreignKey: 'specialty_id'
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize.sync()
    .then(() => console.log("Synchronized"))
    .catch((err) => console.error("Sync Error: ", err));

module.exports = db;