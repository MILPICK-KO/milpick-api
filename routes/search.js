let express = require('express');
let router = express.Router();
let search_controller = require("../controllers/search")

router.use(require("../middlewares/verify").verify_request)

/* GET home page. */
router.get('/', search_controller.search_military);

router.post('/', search_controller.search_military)

module.exports = router;
