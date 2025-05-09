const { Router } = require("express");
const middleware = require("../middlewares/auth");

const router = Router();

const ownApiController = require("../controllers/ownApiController");

router.get("/searchQuery/:query", middleware.auth, ownApiController.searchQuery);
// router.get("/searchNearby", middleware.auth, ownApiController.searchNearby);
router.get("/searchNearby", ownApiController.searchNearby);
router.get("/searchTrends", middleware.auth, ownApiController.searchTrends);

module.exports = router;