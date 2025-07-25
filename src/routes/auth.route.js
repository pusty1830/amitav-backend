const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");
const checkEmail = require("../middlewares/checkEmail");
const authController = require("../controllers/auth.controller");
const { verifySign } = require("../utils/token");
const { prepareBody } = require("../utils/response");
const upload = require("../middlewares/multer.middleware");

router
  .route("/signup")
  .post(
    prepareBody,
    asyncHandler("user", checkEmail),
    asyncHandler("user", authController.signup)
  );

router
  .route("/signin")
  .post(prepareBody, asyncHandler("user", authController.signin));

router
  .route("/admin-signin")
  .post(prepareBody, asyncHandler("user", authController.adminSignin));

router
  .route("/profile")
  .get(verifySign, asyncHandler("user", authController.getProfile));

router
  .route("/search-profile")
  .post(
    prepareBody,
    verifySign,
    asyncHandler("user", authController.searchUserByCond)
  );

router
  .route("/update-profile")
  .patch(
    prepareBody,
    verifySign,
    asyncHandler("user", authController.updateProfile)
  );

router
  .route("/upload-doc")
  .post(upload.array("files", 5), authController.uploadMultiple);

router
  .route("/delete-profile")
  .delete(verifySign, asyncHandler("user", authController.deleteProfile));

router
  .route("/forgot-password")
  .patch(prepareBody, asyncHandler("user", authController.forgotPassword));

router
  .route("/reset-password")
  .patch(prepareBody, asyncHandler("user", authController.resetPassword));

module.exports = router;
