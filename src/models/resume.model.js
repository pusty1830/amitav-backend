const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const Resume = sequelizeConfig.define(
  "resume",
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
    leftheader: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    leftexp: {
      allowNull: false,
      type: Sequelize.JSON,
    },
    rightheader: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    righteducation: {
      allowNull: false,
      type: Sequelize.JSON,
    },
  },
  {
    tableName: "resume",
    timestamps: true,
  }
);

module.exports = Resume;
