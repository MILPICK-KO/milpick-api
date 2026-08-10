const search_service = require("../services/search")

async function search_military(req, res, next) {
    try {
        const result = await search_service.find_speciality_with(req.body.field);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    search_military
}