var jwt = require("jsonwebtoken");
const { prepareResponse } = require("../utils/response");
const {
  SERVER_ERROR_MESSAGE,
  INVALID_ACCESS_TOKEN,
  ACCESS_TOKEN_MISSING,
} = require("./messages");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const httpResponseCodes = require("./http");

let generateSign = (email_id, name, user_status, id, roll) => {
  var token = jwt.sign(
    { email_id, name, id, user_status, roll },
    JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

let verifySign = (req, res, next) => {
  const bearerToken = req.get("Authorization") || req.headers["x-access-token"];
  if (!bearerToken) {
    return res
      .status(httpResponseCodes.UNAUTHORIZED)
      .json(prepareResponse("UNAUTHORIZED", ACCESS_TOKEN_MISSING, null, null));
  }
  try {
    jwt.verify(bearerToken, JWT_SECRET_KEY, function (error, decoded) {
      if (error) {
        return res
          .status(httpResponseCodes.UNAUTHORIZED)
          .json(
            prepareResponse("FORBIDDEN", INVALID_ACCESS_TOKEN, null, error)
          );
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    return res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
module.exports = {
  generateSign,
  verifySign,
};
