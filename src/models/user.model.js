const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const User = sequelizeConfig.define(
  "users",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING(50),
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING(50),
    },
    role: {
      // e.g., Admin, User
      allowNull: false,
      type: Sequelize.STRING(30),
      defaultValue: "User",
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING(30),
      defaultValue: "ACTIVE",
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING(100),
    },
    phoneNumber: {
      allowNull: false,
      type: Sequelize.STRING(20),
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    gender: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    profileImage: {
      allowNull: true,
      type: Sequelize.STRING(300),
    },

    token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    laguage: {
      allowNull: true,
      type: Sequelize.STRING(255),
    },
    freelance: {
      allowNull: true,
      type: Sequelize.STRING(255),
    },
    cv: {
      allowNull: true,
      type: Sequelize.STRING(255),
    },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      { fields: ["id"] },
      { fields: ["firstName"] },
      { fields: ["lastName"] },
    ],
  }
);

module.exports = User;
