const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class SpecialityCertification extends Model {}
    SpecialityCertification.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        specialty_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        certification_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SpecialityCertification',
        tableName: 'specialty_certifications',
        timestamps: false
    });
    return SpecialityCertification;
};
