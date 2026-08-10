// models/SpecialityDirectField.js
const { Model, DataTypes } = require('sequelize');

class SpecialityDirectField extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                specialty_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                field_name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                }
            },
            {
                sequelize,
                modelName: 'SpecialityDirectField',
                tableName: 'specialty_direct_fields', // DB에 있는 실제 테이블명
                timestamps: false,
                underscored: true,
            }
        );
    }
}

module.exports = SpecialityDirectField;