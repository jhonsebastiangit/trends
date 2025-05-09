const { Router } = require("express");
const middleware = require("../middlewares/auth");

const router = Router();

const queryHistoryController = require("../controllers/QueryHistoryController");

router.post("/registerSearch/:query", middleware.auth, queryHistoryController.registerSearch);
router.get("/getSearchNear/:latitude/:longitude", middleware.auth, queryHistoryController.getSearchNear);
router.get("/getGeneralSearch", middleware.auth, queryHistoryController.getGeneralSearch);
router.get("/getSearchUser/:userId", middleware.auth, queryHistoryController.getSearchUser);

module.exports = router;