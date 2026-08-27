const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class VSpecialtySummary extends Model {}
    VSpecialtySummary.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true
        },
        recruitment_type: DataTypes.STRING(50),
        specialty_code: DataTypes.STRING(20),
        specialty_name: DataTypes.STRING(100),
        category: DataTypes.STRING(50),
        duty_description: DataTypes.TEXT,
        qualification_description: DataTypes.TEXT,
        major_required: DataTypes.BOOLEAN,
        age_limit_min: DataTypes.INTEGER,
        age_limit_max: DataTypes.INTEGER,
        physical_grade_max: DataTypes.INTEGER,
        physical_condition_raw: DataTypes.TEXT,
        height_min_cm: DataTypes.INTEGER,
        height_max_cm: DataTypes.INTEGER,
        weight_min_kg: DataTypes.INTEGER,
        weight_max_kg: DataTypes.INTEGER,
        vision_min: DataTypes.DECIMAL(3, 1),
        workplace: DataTypes.STRING(200),
        additional_info: DataTypes.TEXT,
        direct_fields: DataTypes.TEXT,
        indirect_fields: DataTypes.TEXT,
        certifications: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'VSpecialtySummary',
        tableName: 'v_specialty_summary',
        timestamps: false
    });
    return VSpecialtySummary;
};
