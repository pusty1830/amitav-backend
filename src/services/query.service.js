const { Op } = require("sequelize");
const model = require("../models/mappingIndex");

let addData = async (tableName, obj) => {
  return await model[tableName].create(obj);
};

let addBulkData = async (tableName, obj) => {
  return await model[tableName].bulkCreate(obj);
};

let updateData = async (tableName, cond, obj) => {
  return await model[tableName].update(obj, { where: cond });
};

let destroyData = async (tableName, cond) => {
  return await model[tableName].destroy({ where: cond });
};

let getAllData = async (tableName) => {
  return await model[tableName].findAll();
};

let getAllDataByCond = async (tableName, cond) => {
  if (cond.fieldName) {
    if (cond.fieldName.toLowerCase().includes("date")) {
      cond[cond.fieldName] = { [Op.gte]: new Date(cond.fieldValue) };
      delete cond.fieldName;
      delete cond.fieldValue;
    }
    return await model[tableName].findAll({ where: cond });
  } else return await model[tableName].findAll({ where: cond });
};

let findAndCountAllDataByCond = async (tableName, cond, other) => {
  return await model[tableName].findAndCountAll({ where: cond, ...other });
};

let getAllDataByCondAndPagination = async (
  tableName,
  cond,
  page,
  pageSize,
  order
) => {
  const offset = page * pageSize;
  const limit = pageSize;
  let filter = cond.filter;
  let fields = cond.fields;
  delete cond.filter;
  if (filter !== "") {
    let fieldToSearch = [];
    return async
      .each(fields, (field, after_field) => {
        fieldToSearch.push({ [field]: { [Op.like]: `%${filter}%` } });
        after_field();
      })
      .then(async () => {
        cond = {
          ...cond,
          [Op.or]: fieldToSearch,
        };
        return await model[tableName].findAndCountAll({
          limit,
          offset,
          where: cond,
          order,
          // order: [['createdAt', order]],
        });
      });
  } else {
    return await model[tableName].findAndCountAll({
      limit,
      offset,
      where: cond,
      order: order,
    });
  }
};

let getOneDataByCond = async (tableName, cond) => {
  return await model[tableName].findOne({
    where: cond,
  });
};

let getAllDataByAttr = async (tableName, attr) => {
  return await model[tableName].findAll({
    attributes: attr,
  });
};

let getAllDataByCondAndAttr = async (tableName, cond, attr) => {
  return await model[tableName].findAll({
    where: cond,
    attributes: attr,
  });
};

let getOneDataByCondAndAttr = async (tableName, cond, attr) => {
  return await model[tableName].findOne({
    where: cond,
    attributes: attr,
  });
};

let getAllDataByCondWithHasAll = async (tableName, cond, secondTable) => {
  return await model[tableName].findAll({
    where: cond,
    include: model[secondTable],
  });
};

let getOneDataByCondWithHasAll = async (tableName, cond, secondTable) => {
  return await model[tableName].findOne({
    where: cond,
    include: model[secondTable],
  });
};

let getAllDataByCondWithBelongsTo = async (tableName, cond, secondTable) => {
  return await model[tableName].findAll({
    where: cond,
    include: model[secondTable],
  });
};

let getOneDataByCondWithBelongsTo = async (tableName, cond, secondTable) => {
  return await model[tableName].findOne({
    where: cond,
    include: model[secondTable],
  });
};

module.exports = {
  addData,
  addBulkData,
  updateData,
  destroyData,
  getAllData,
  getAllDataByCond,
  getOneDataByCond,
  getAllDataByAttr,
  getAllDataByCondAndAttr,
  getOneDataByCondAndAttr,
  getAllDataByCondAndPagination,
  findAndCountAllDataByCond,
  getAllDataByCondWithHasAll,
  getOneDataByCondWithHasAll,
  getAllDataByCondWithBelongsTo,
  getOneDataByCondWithBelongsTo,
};
