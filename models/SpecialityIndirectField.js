const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class SpecialityIndirectField extends Model {}
    SpecialityIndirectField.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        specialty_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        field_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SpecialityIndirectField',
        tableName: 'specialty_indirect_fields',
        timestamps: false
    });
    return SpecialityIndirectField;
};
