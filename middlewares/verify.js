const fields = require("../types/specialties.json")

async function verify_request(req, res, next) {
    const field = req.body?.['field'];
    const exclude = req.body?.['exclude'];

    if (!field && !exclude) {
        res.status(400).send("Necessary request body is empty.");
        return;
    }

    // verify if requested field is legal
    if (field) {
        for (const element of field) {
            if (!fields.direct_fields.includes(element)) {
                res.status(400).send(`Field "${element}" is illegal.`);
                return;
            }
        }
    }

    if (exclude) {
        for (const element of exclude) {
            if (!fields.exclusions.includes(element)) {
                res.status(400).send(`Exclude field "${element}" is illegal.`);
                return;
            }
        }
    }

    next();
}

module.exports = {
    verify_request
}