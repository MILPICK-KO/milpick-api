const With = require("../types/search_with")
const { Op, Sequelize } = require('sequelize');
const db = require("../models")

async function find_speciality_with(withWhat, excludeWhat, height, physicalGrade, vision){
    let excludedIds = [];
    if (excludeWhat && excludeWhat.length > 0) {
        const exclusions = await db.SpecialityExclusion.findAll({
            where: { condition_name: { [Op.in]: excludeWhat } },
            attributes: ['specialty_id'],
            raw: true
        });
        excludedIds = exclusions.map(e => e.specialty_id);
    }

    const mainWhere = {};
    const andConditions = [];

    if (excludedIds.length > 0) {
        andConditions.push({ id: { [Op.notIn]: excludedIds } });
    }

    if (physicalGrade !== undefined && physicalGrade !== null) {
        andConditions.push({
            [Op.or]: [
                { physical_grade_max: { [Op.gte]: physicalGrade } },
                { physical_grade_max: null }
            ]
        });
    }

    if (height !== undefined && height !== null) {
        andConditions.push({
            [Op.or]: [
                { height_min_cm: { [Op.lte]: height } },
                { height_min_cm: null }
            ]
        });
        andConditions.push({
            [Op.or]: [
                { height_max_cm: { [Op.gte]: height } },
                { height_max_cm: null }
            ]
        });
    }

    if (vision !== undefined && vision !== null) {
        andConditions.push({
            [Op.or]: [
                { vision_min: { [Op.lte]: vision } },
                { vision_min: null }
            ]
        });
    }

    if (andConditions.length > 0) {
        mainWhere[Op.and] = andConditions;
    }

    const includes = [];
    if (withWhat && withWhat.length > 0) {
        includes.push({
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
        });
    } else {
        includes.push({
            model: db.SpecialityDirectField,
            as: 'directFields',
            attributes: [],
            required: false // LEFT JOIN
        });
    }

    const results = await db.Speciality.findAll({
        where: mainWhere,
        attributes: {
            include: [
                [
                    Sequelize.literal("GROUP_CONCAT(`directFields`.`field_name` SEPARATOR ', ')"),
                    '매칭된_관련분야'
                ],
                [
                    // DB에서 major_required는 tinyint(1)이므로 1일 때 'O'
                    Sequelize.literal("CASE WHEN `MilitarySpecialty`.`major_required` = 1 THEN 'O' ELSE 'X' END"),
                    '전공필수'
                ]
            ]
        },
        include: includes,
        group: ['MilitarySpecialty.id'],
        order: [
            ['category', 'ASC'],
            ['specialty_name', 'ASC']
        ],
        raw: true
    });

    const formattedResults = results.map(row => {
        if (row.vision_min !== null && row.vision_min !== undefined) {
            row.vision_min = parseFloat(row.vision_min);
        }
        delete row.id;
        return row;
    });

    console.log(formattedResults);
    return formattedResults;
}

module.exports = {
    find_speciality_with

}