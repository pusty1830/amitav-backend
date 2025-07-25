const { Op } = require("sequelize");
const user = require('../models/user.model')

let addUser = async (obj) => {
    return await user.create(obj);
}

let bulkUser = async (obj) => {
    return await user.bulkCreate(obj);
}


let updateUser = async (id, obj) => {
    return await user.update(obj, { where: { id: id } });
}

let destroyUserDetails = async (id,obj) => {
    await user.update(obj, { where: { id: id } });
    return true;
}

let destroyUser = async (id) => {
    return await user.destroy({ where: { id: id } });
}

let getAllUser = async () => {
    return await user.findAll();
}


let getAllUserByCond = async (cond) => {
    return await user.findAll({ where: cond });
}


let findAndCountAllUserByCond = async (cond, other) => {
    return await user.findAndCountAll({ where: cond, ...other });
}

let getAllUserByCondAndPagination = async (cond, page, pageSize, order) => {
    const offset = page * pageSize;
    const limit = pageSize;
    let filter = cond.filter;
    delete cond.filter;
    if (filter !== '') {
        cond = {
            [Op.or]: [
                { firstName: { [Op.like]: `%${filter}%` } },
                { lastName: { [Op.like]: `%${filter}%` } },
            ],
            ...cond
        }
    }
    return await user.findAndCountAll({
        limit, offset, where: cond,
        order: order,
    });
}

let getOneUserByCond = async (cond) => {
    return await user.findOne({
        where: cond
    });
}



let getAllUserByAttr = async (attr) => {
    return await user.findAll({
        attributes: attr
    });
}


let getAllUserByCondAndAttr = async (cond, attr) => {
    return await user.findAll({
        where: cond,
        attributes: attr
    });
}


let getOneUserByCondAndAttr = async (cond, attr) => {
    return await user.findOne({
        where: cond,
        attributes: attr
    });
}



module.exports = {
    addUser,
    bulkUser,
    updateUser,
    destroyUser,
    getAllUser,
    getAllUserByCond,
    getOneUserByCond,
    getAllUserByAttr,
    getAllUserByCondAndAttr,
    getOneUserByCondAndAttr,
    getAllUserByCondAndPagination,
    findAndCountAllUserByCond,
    destroyUserDetails
}