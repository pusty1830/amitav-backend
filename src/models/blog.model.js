const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");
const User = require("./user.model");

const Blog = sequelizeConfig.define(
  "blog",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: { model: User, key: "id" },
      allowNull: false,
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },

    blogImg: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    content: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    blogVdo: {
      allowNull: true,
      type: Sequelize.STRING(255),
    },
  },
  {
    tableName: "blog",
    timestamps: true,
  }
);

module.exports = Blog;
