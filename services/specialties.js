const db = require('../models');

let cachedSpecialties = null;

async function get_all_specialties(recruitmentType) {
    if (!cachedSpecialties) {
        const results = await db.VSpecialtySummary.findAll({
            order: [
                ['recruitment_type', 'ASC'],
                ['category', 'ASC'],
                ['specialty_name', 'ASC']
            ],
            raw: true
        });

        cachedSpecialties = results.map(row => {
            if (row.vision_min !== null && row.vision_min !== undefined) {
                row.vision_min = parseFloat(row.vision_min);
            }
            if (row.major_required !== null && row.major_required !== undefined) {
                row.major_required = row.major_required ? 1 : 0;
            }
            delete row.id;
            return row;
        });
    }

    if (recruitmentType) {
        if (Array.isArray(recruitmentType)) {
            return cachedSpecialties.filter(item => recruitmentType.includes(item.recruitment_type));
        }
        return cachedSpecialties.filter(item => item.recruitment_type === recruitmentType);
    }

    return cachedSpecialties;
}

module.exports = {
    get_all_specialties
};
