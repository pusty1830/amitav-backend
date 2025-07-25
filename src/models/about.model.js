const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const About = sequelizeConfig.define(
  "about",
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
    leftImg: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    rightSide: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    rightSideSubtittle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    rightSidepara: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
  },
  {
    tableName: "about",
    timestamps: true,
  }
);

module.exports = About;
