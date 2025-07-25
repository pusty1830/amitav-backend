const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");
const User = require("./user.model");

const Reviews = sequelizeConfig.define(
  "reviews",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: { model: User, key: "id" },
      allowNull: false,
    },
    review: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
  }
);

module.exports = Reviews;
