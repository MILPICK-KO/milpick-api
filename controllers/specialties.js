const specialties_service = require('../services/specialties');

async function get_all_specialties(req, res, next) {
    try {
        const recruitmentType = req.query.recruitment_type;
        const result = await specialties_service.get_all_specialties(recruitmentType);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    get_all_specialties
};
