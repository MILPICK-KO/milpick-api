
async function verify_request(req, res, next) {
    const field = req.body?.['field'];
    const exclude = req.body?.['exclude'];

    if (!field && !exclude) {
        res.status(400).send("Necessary request body is empty.");
        return;
    }

    // We no longer validate against a hardcoded JSON file because the database
    // has been updated and handles invalid/unknown keywords safely by returning [].

    next();
}

module.exports = {
    verify_request
}