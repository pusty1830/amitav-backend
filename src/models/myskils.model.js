const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const MySkills = sequelizeConfig.define(
  "myskills",
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
    leftTitle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    leftSubTitle: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    rightSkills: {
      allowNull: false,
      type: Sequelize.JSON,
    },
  },
  {
    tableName: "myskills",
    timestamps: true,
  }
);

module.exports = MySkills;
