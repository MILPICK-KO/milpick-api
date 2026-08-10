const With = require("../types/search_with")
const { Op, Sequelize } = require('sequelize');
const db = require("../models")

async function find_speciality_with(withWhat){
    const results = await db.Speciality.findAll({
        attributes: [
            ['military_branch', '군'],
            ['specialty_name', '특기명'],
            ['category', '병과'],
            [
                Sequelize.literal("GROUP_CONCAT(`directFields`.`field_name` SEPARATOR ', ')"),
                '매칭된_관련분야'
            ],
            [
                // DB에서 major_required는 tinyint(1)이므로 1일 때 'O'
                Sequelize.literal("CASE WHEN `MilitarySpecialty`.`major_required` = 1 THEN 'O' ELSE 'X' END"),
                '전공필수'
            ],
            ['physical_grade_max', '최소등급']
        ],
        include: [
            {
                model: db.SpecialityDirectField,
                as: 'directFields',
                attributes: [],
                where: {
                    [Op.or]: withWhat.map(w => ({
                        field_name: {
                            [Op.like]: `%${w}%`
                        }
                    }))
                },
                required: true // INNER JOIN
            }
        ],
        group: ['MilitarySpecialty.id'],
        order: [
            ['military_branch', 'ASC'],
            ['specialty_name', 'ASC']
        ],
        raw: true
    });

    return results;
}

module.exports = {
    find_speciality_with
}