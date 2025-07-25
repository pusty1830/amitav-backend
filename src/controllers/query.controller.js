const query = require("../services/query.service");
const { prepareResponse } = require("../utils/response");
const {
  SERVER_ERROR_MESSAGE,
  ADD,
  GET,
  UPDATE,
  DELETE,
} = require("../utils/messages");
const httpResponseCodes = require("../utils/http");
const { getRawData } = require("../utils/functions");

exports.insertData = async (req, res) => {
  try {
    let result = await query.addData(req.tableName, req.body);
    res
      .status(httpResponseCodes.CREATED)
      .json(prepareResponse("CREATED", ADD, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.insertManyData = async (req, res) => {
  try {
    let result = await query.addBulkData(req.tableName, req.body);
    res
      .status(httpResponseCodes.CREATED)
      .json(prepareResponse("CREATED", ADD, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.updateData = async (req, res) => {
  try {
    let result = await query.updateData(req.tableName, req.params, req.body);
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("UPDATE", UPDATE, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.updateStatusByKey = async (req, res) => {
  try {
    let result = await query.getOneDataByCond(req.tableName, req.query);
    result = getRawData(result);
    if (result?.status === req.body?.status) {
      res
        .status(httpResponseCodes.OK)
        .json(prepareResponse("UPDATE", UPDATE, result, null));
    } else {
      let result = await query.updateData(req.tableName, req.query, req.body);
      res
        .status(httpResponseCodes.OK)
        .json(prepareResponse("UPDATE", UPDATE, result, null));
    }
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.destroyData = async (req, res) => {
  try {
    let result = await query.destroyData(req.tableName, req.params);
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("DELETE", DELETE, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getallData = async (req, res) => {
  try {
    let result = await query.getAllDataByCond(req.tableName, req.body);
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getOneData = async (req, res) => {
  try {
    let result = await query.getOneDataByCond(req.tableName, req.params);
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getOneDataByUniqeKey = async (req, res) => {
  try {
    let result = await query.getOneDataByCond(req.tableName, req.query);
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.searchData = async (req, res) => {
  try {
    let cond = req.body.data;
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    let order = req.body.order;
    let result = await query.getAllDataByCondAndPagination(
      req.tableName,
      cond,
      page,
      pageSize,
      order
    );
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getallDataWithHasAll = async (req, res) => {
  try {
    let secondTable = req.body.secondTable;
    delete req.body.secondTable;
    let result = await query.getAllDataByCondWithHasAll(
      req.tableName,
      req.body,
      req.body,
      secondTable
    );
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getallDataWithBelongsTo = async (req, res) => {
  try {
    let secondTable = req.body.secondTable;
    delete req.body.secondTable;
    let result = await query.getAllDataByCondWithBelongsTo(
      req.tableName,
      req.body,
      secondTable
    );
    res
      .status(httpResponseCodes.OK)
      .json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
