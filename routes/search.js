let express = require('express');
let router = express.Router();
let search_controller = require("../controllers/search")

router.get('/fields', search_controller.get_all_fields);
router.get('/recommend', search_controller.recommend_fields);
router.get('/exclusions', search_controller.get_all_exclusions);

router.use(require("../middlewares/verify").verify_request)

/* GET home page. */
router.get('/', search_controller.search_military);

router.post('/', search_controller.search_military)

module.exports = router;
