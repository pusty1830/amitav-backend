const router = require("express").Router();

router.use("/auth", require("./auth.route"));
router.use("/:tableName", require("./query.route"));
router.use("/ai", require("./ai.route"));

module.exports = router;
