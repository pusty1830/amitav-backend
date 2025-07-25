const router = require("express").Router({ mergeParams: true });
const { asyncHandler } = require("../middlewares/asyncHandler");
const queryController = require("../controllers/query.controller");
const { prepareBody } = require("../utils/response");

router
  .route("/create")
  .post(prepareBody, asyncHandler("", queryController.insertData));

router
  .route("/insertMany")
  .post(prepareBody, asyncHandler("", queryController.insertManyData));

router
  .route("/get-all-record")
  .post(prepareBody, asyncHandler("", queryController.getallData));

router
  .route("/get-all-record-with-has-all")
  .post(prepareBody, asyncHandler("", queryController.getallDataWithHasAll));

router
  .route("/get-all-record-with-belongs-to")
  .post(prepareBody, asyncHandler("", queryController.getallDataWithBelongsTo));

router
  .route("/get-all-open-record")
  .post(prepareBody, asyncHandler("", queryController.getallData));

router
  .route("/get-one-record/:id")
  .get(asyncHandler("", queryController.getOneData));

router
  .route("/get-one-open-record")
  .get(asyncHandler("", queryController.getOneDataByUniqeKey));

router
  .route("/search-one-record")
  .get(asyncHandler("", queryController.getOneDataByUniqeKey));

router
  .route("/search-record")
  .post(prepareBody, asyncHandler("", queryController.searchData));

router
  .route("/update-record/:id")
  .patch(prepareBody, asyncHandler("", queryController.updateData));

router
  .route("/update-status-by-key")
  .patch(prepareBody, asyncHandler("", queryController.updateStatusByKey));

router
  .route("/delete-record/:id")
  .delete(asyncHandler("", queryController.destroyData));

module.exports = router;
