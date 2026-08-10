const { Model, DataTypes } = require('sequelize');

class Speciality extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                recruitment_type: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                specialty_code: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                specialty_name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                category: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                duty_description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                qualification_description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                major_required: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                age_limit_min: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                age_limit_max: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                physical_grade_max: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                physical_condition_raw: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                height_min_cm: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                height_max_cm: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                weight_min_kg: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                weight_max_kg: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                vision_min: {
                    type: DataTypes.DECIMAL(3, 1),
                    allowNull: true,
                },
                workplace: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                additional_info: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: 'MilitarySpecialty',
                tableName: 'specialties',
                timestamps: true,
                underscored: true,
                indexes: [
                    { fields: ['specialty_code'] },
                    { fields: ['category'] },
                    { fields: ['major_required'] },
                    { fields: ['age_limit_min'] },
                    { fields: ['physical_grade_max'] },
                ],
            }
        );
    }
}

module.exports = Speciality;