const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const Portfolio = sequelizeConfig.define(
  "portfolio",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    cardImage: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    cardTitle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    cardsubtitle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
  },
  {
    tableName: "portfolio",
    timestamps: true,
  }
);

module.exports = Portfolio;
