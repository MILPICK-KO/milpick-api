let express = require('express');
let router = express.Router();
let search_controller = require("../controllers/search")

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("Search router working");
});

router.post('/', search_controller.search_military)

module.exports = router;
