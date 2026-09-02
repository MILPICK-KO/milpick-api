const { Op, Sequelize } = require('sequelize');
const db = require("../models")

async function find_speciality_with(withWhat, excludeWhat, height, physicalGrade, vision, relationType = 'all', recruitmentType) {
    let keywords = [];
    if (withWhat && Array.isArray(withWhat)) {
        keywords.push(...withWhat);
    }
    keywords = [...new Set(keywords)];

    if (withWhat && withWhat.length > 0 && keywords.length === 0) {
        return [];
    }

    let includedIds = null;
    const matchTypeMap = {}; // specialty_id -> 'direct' | 'indirect'

    if (keywords.length > 0) {
        const ids = new Set();
        
        if (relationType === 'direct' || relationType === 'all') {
            const directMatches = await db.SpecialityDirectField.findAll({
                where: { field_name: { [Op.in]: keywords } },
                attributes: ['specialty_id'],
                raw: true
            });
            directMatches.forEach(m => {
                ids.add(m.specialty_id);
                matchTypeMap[m.specialty_id] = 'direct';
            });
        }
        
        if (relationType === 'indirect' || relationType === 'all') {
            const indirectMatches = await db.SpecialityIndirectField.findAll({
                where: { field_name: { [Op.in]: keywords } },
                attributes: ['specialty_id'],
                raw: true
            });
            indirectMatches.forEach(m => {
                ids.add(m.specialty_id);
                if (!matchTypeMap[m.specialty_id]) {
                    matchTypeMap[m.specialty_id] = 'indirect';
                }
            });
        }
        
        includedIds = Array.from(ids);
        
        if (includedIds.length === 0) {
            return [];
        }
    }

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

    if (includedIds !== null) {
        andConditions.push({ id: { [Op.in]: includedIds } });
    }

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

    if (recruitmentType) {
        let rTypes = Array.isArray(recruitmentType) ? recruitmentType : [recruitmentType];
        if (rTypes.length > 0) {
            andConditions.push({ recruitment_type: { [Op.in]: rTypes } });
        }
    }

    if (andConditions.length > 0) {
        mainWhere[Op.and] = andConditions;
    }

    const validSpecialties = await db.Speciality.findAll({
        where: mainWhere,
        attributes: ['id'],
        raw: true
    });

    const validIds = validSpecialties.map(s => s.id);

    if (validIds.length === 0) {
        return [];
    }

    const results = await db.VSpecialtySummary.findAll({
        where: { id: { [Op.in]: validIds } },
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
        
        if (keywords.length > 0) {
            row.match_type = matchTypeMap[row.id] || 'indirect';
        }
        
        delete row.id;
        return row;
    });

    return formattedResults;
}

async function recommend_fields(major) {
    if (!major) return [];
    const mappings = await db.MajorMapping.findAll({
        where: { university_major: { [Op.like]: `%${major}%` } },
        attributes: ['mapped_field'],
        raw: true
    });
    return [...new Set(mappings.map(m => m.mapped_field))];
}

let cachedFields = null;
let cachedExclusions = null;

async function get_all_fields() {
    if (cachedFields) {
        return cachedFields;
    }

    const directFields = await db.SpecialityDirectField.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('field_name')), 'field_name']],
        raw: true
    });
    const indirectFields = await db.SpecialityIndirectField.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('field_name')), 'field_name']],
        raw: true
    });

    const allFields = new Set();
    directFields.forEach(f => allFields.add(f.field_name));
    indirectFields.forEach(f => allFields.add(f.field_name));
    
    cachedFields = Array.from(allFields).sort();
    return cachedFields;
}

async function get_all_exclusions() {
    if (cachedExclusions) {
        return cachedExclusions;
    }
    
    const exclusions = await db.SpecialityExclusion.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('condition_name')), 'condition_name']],
        raw: true
    });
    
    cachedExclusions = exclusions.map(e => e.condition_name).sort();
    return cachedExclusions;
}

module.exports = {
    find_speciality_with,
    recommend_fields,
    get_all_fields,
    get_all_exclusions
}