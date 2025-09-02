const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const Contact = sequelizeConfig.define(
  "contact",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },

    name: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    yourSubject: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    message: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
  },
  {
    tableName: "contact",
    timestamps: true,
  }
);

module.exports = Contact;
