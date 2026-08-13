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
        major_required: DataTypes.BOOLEAN,
        physical_grade_max: DataTypes.INTEGER,
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
