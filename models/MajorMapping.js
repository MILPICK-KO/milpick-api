const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class MajorMapping extends Model {}
    MajorMapping.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        university_major: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        mapped_field: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'MajorMapping',
        tableName: 'major_mappings',
        timestamps: false
    });
    return MajorMapping;
};
