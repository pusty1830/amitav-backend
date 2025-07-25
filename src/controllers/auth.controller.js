const User = require("../services/user.service");
const { getRawData } = require("../utils/functions");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateSign } = require("../utils/token");
const query = require("../services/query.service");
const { prepareResponse } = require("../utils/response");
const httpResponseCodes = require("../utils/http");
const bcrypt = require("bcryptjs");
const {
  VERIFY_EMAIL_BEFORE_LOGIN,
  USER_PROFILE,
  LOGIN,
  UPDATE_PROFILE_SUCCESS,
  ACCOUNT_NOT_FOUND,
  CURRENT_PASSWORD_INCORRECT,
  CONTACT_SUPPORT,
  SERVER_ERROR_MESSAGE,
  DELETE,
  UPLOADED,
  RESET_PASS_LINK_SENT,
  RESET_PASS_SUCCESS,
} = require("../utils/messages");
const sendEmail = require("../utils/mail");

exports.signup = async (req, res) => {
  try {
    let body = req.body;

    const plainPassword = body.password?.trim() || "123456";
    body.password = await hashPassword(plainPassword);

    let result = await User.addUser(body);
    result = getRawData(result);

    // Send welcome email with credentials
    await sendEmail(
      result.email,
      "Welcome to Amitav's Family",
      "emailTamplet",
      {
        name: "User",
        subject: "Welcome to Amitav's Family",
      }
    );
    res
      .status(httpResponseCodes.CREATED)
      .json(
        prepareResponse("CREATED", VERIFY_EMAIL_BEFORE_LOGIN, result, null)
      );
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let body = req.body;
    let result = await User.updateUser(req.decoded.id, body);
    result = getRawData(result);
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", UPDATE_PROFILE_SUCCESS, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.signin = async (req, res) => {
  try {
    let result = await User.getOneUserByCond({ email: req.body.email });
    result = getRawData(result);

    if (!result) {
      return res
        .status(httpResponseCodes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }

    // Check password
    const hash = comparePassword(req.body.password, result.password);
    if (!hash) {
      return res
        .status(httpResponseCodes.FORBIDDEN)
        .json(
          prepareResponse("FORBIDDEN", CURRENT_PASSWORD_INCORRECT, null, null)
        );
    }

    // Block if archived
    if (result.status === "ARCHIVED") {
      return res
        .status(httpResponseCodes.FORBIDDEN)
        .json(prepareResponse("FORBIDDEN", CONTACT_SUPPORT, null, null));
    }

    // ✅ Only for Admins → check Payment or Trial
    if (result.role === "Admin" && !result.hasPaid) {
      const now = new Date();
      const trialEnds = new Date(result.trialStartDate);
      trialEnds.setDate(trialEnds.getDate() + 7);

      if (now > trialEnds) {
        // Trial expired and not paid
        return res
          .status(httpResponseCodes.FORBIDDEN)
          .json(
            prepareResponse(
              "FORBIDDEN",
              "Your 7days free trial has expired. Please complete payment to continue as Admin.",
              null,
              null
            )
          );
      }
    }

    // Passed all checks → Generate token
    let token = await generateSign(
      result.email,
      result.firstName,
      result.status,
      result.id,
      result.role
    );

    result.accessToken = token;

    return res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", LOGIN, result, null));
  } catch (error) {
    return res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.adminSignin = async (req, res) => {
  try {
    let result = await query.getOneDataByCond("adminLogin", {
      email: req.body.email,
      password: req.body.password,
    });
    result = getRawData(result);
    if (result) {
      let token = await generateSign(
        result.email,
        result.userName,
        result.status,
        result.id,
        result.roll
      );
      result.accessToken = token;
      res
        .status(httpResponseCodes.OK)
        .json(prepareResponse("OK", LOGIN, result, null));
    } else {
      res
        .status(httpResponseCodes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.searchUserByCond = async (req, res) => {
  try {
    let cond = req.body.data;
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    let order = req.body.order;
    if (cond.supervisorId === "") {
      cond.supervisorId = req.decoded.id;
    }
    let users = await User.getAllUserByCondAndPagination(
      cond,
      page,
      pageSize,
      order
    );
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", USER_PROFILE, users, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getProfile = async (req, res) => {
  try {
    let user = await User.getOneUserByCond({ id: req.decoded.id });
    if (user) {
      res
        .status(httpResponseCodes.OK)
        .json(prepareResponse("OK", USER_PROFILE, user, null));
    } else {
      res
        .status(httpResponseCodes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    let userId = req.decoded.id;
    let user = await User.getOneUserByCond({ id: userId });
    if (user) {
      await User.destroyUser(userId);
      res
        .status(httpResponseCodes.OK)
        .json(prepareResponse("OK", DELETE, null, null));
    } else {
      res
        .status(httpResponseCodes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.uploadMultiple = (req, res) => {
  // req.files contains an array of file object
  if (Array.isArray(req.files)) {
    let files = req.files;
    let data = {};
    files.forEach((element, index) => {
      data[`doc${index}`] = element.location;
    });
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", UPLOADED, data, null));
  } else {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, null));
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let token = Math.floor(100000 + Math.random() * 900000);
    let result = await User.getOneUserByCond(req.body);
    result = getRawData(result);
    if (result) {
      await User.updateUser(result.id, { token: token });
      await sendEmail(
        result.email,
        "Your Livoso Password Reset OTP",
        "otpEmail", // your EJS template
        {
          name: result.firstName || "User",
          otp: token,
          subject: "Your Livoso Password Reset OTP",
        }
      );
      res
        .status(httpResponseCodes.OK)
        .json(prepareResponse("OK", RESET_PASS_LINK_SENT, result, null));
    } else {
      res
        .status(httpResponseCodes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let obj = req.body;
    obj.password = await bcrypt.hash(obj.password, 10);
    let user = await User.getOneUserByCond({
      email: obj.email,
      token: obj.token,
    });
    user = getRawData(user);
    if (user) {
      let result = await User.updateUser(user.id, {
        token: null,
        password: obj.password,
      });

      res
        .status(httpResponseCodes.OK)
        .json(prepareResponse("OK", RESET_PASS_SUCCESS, user, null));
    } else {
      res
        .status(httpResponseCodes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
