const router = require("express").Router();

router.use("/auth", require("./auth.route"));
router.use("/:tableName", require("./query.route"));


module.exports = router;
