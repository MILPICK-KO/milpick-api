// models/FieldMapping.js
const { Model, DataTypes } = require('sequelize');

class FieldMapping extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                original_field_name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                unified_field_name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                }
            },
            {
                sequelize,
                modelName: 'FieldMapping',
                tableName: 'field_mappings',
                timestamps: false,
                underscored: true,
            }
        );
    }
}

module.exports = FieldMapping;
