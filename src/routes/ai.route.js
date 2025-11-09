// /routes/ai.routes.js
const router = require("express").Router({ mergeParams: true });
const { asyncHandler } = require("../middlewares/asyncHandler");
const { prepareBody } = require("../utils/response");
const aiController = require("../controllers/ai.controller");

// POST /ai/message  -> single model or "amitav" best-of
router
  .route("/message")
  .post(prepareBody, asyncHandler("", aiController.sendMessage));

// GET /ai/models     -> see configured models + judge
router.route("/models").get(asyncHandler("", aiController.listModels));

module.exports = router;
