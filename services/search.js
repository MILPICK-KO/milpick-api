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
        
        // 1. 단일화 키워드를 원본 DB 키워드 목록으로 확장
        const mappings = await db.FieldMapping.findAll({
            where: { unified_field_name: { [Op.in]: keywords } },
            attributes: ['original_field_name'],
            raw: true
        });
        
        // 원본 키워드 + 혹시 직접 들어온 원본 키워드가 있다면 병합
        const expandedKeywords = [
            ...new Set([...keywords, ...mappings.map(m => m.original_field_name)])
        ];

        // 2. 확장된 키워드로 기존 direct/indirect 필드 조회
        if (relationType === 'direct' || relationType === 'all') {
            const directMatches = await db.SpecialityDirectField.findAll({
                where: { field_name: { [Op.in]: expandedKeywords } },
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
                where: { field_name: { [Op.in]: expandedKeywords } },
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

    // field_mappings 테이블에서 DISTINCT unified_field_name 추출
    const mappings = await db.FieldMapping.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('unified_field_name')), 'field_name']
        ],
        raw: true
    });

    cachedFields = mappings.map(m => m.field_name).sort();
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