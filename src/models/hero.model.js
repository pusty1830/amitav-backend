const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const Hero = sequelizeConfig.define(
  "hero",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    herophoto: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    herotitle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    heroSubTitle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    socialMediaLinks: {
      allowNull: false,
      type: Sequelize.JSON,
    },
  },
  {
    tableName: "hero",
    timestamps: true,
  }
);

module.exports = Hero;
