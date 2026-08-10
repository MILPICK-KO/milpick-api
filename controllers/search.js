const search_service = require("../services/search")

async function search_military(req, res, next) {
    try {
        const { field, exclude, height, physical_grade, vision } = req.body;
        const result = await search_service.find_speciality_with(field, exclude, height, physical_grade, vision);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    search_military
}