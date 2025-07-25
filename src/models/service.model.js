const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const Service = sequelizeConfig.define(
  "service",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    icon: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    cardTitile: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    cardSubTitle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
  },
  {
    tableName: "service",
    timestamps: true,
  }
);

module.exports = Service;
