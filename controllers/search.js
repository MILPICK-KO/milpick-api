const search_service = require("../services/search")

async function search_military(req, res, next) {
    console.log(req)
    res.send("Hello from search service!")
}

module.exports = {
    search_military
}