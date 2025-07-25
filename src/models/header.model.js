const Sequelize = require("sequelize");
const sequelizeConfig = require("../config/db.config");

const Header = sequelizeConfig.define(
  "header",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    fieldName: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    logo:{
        allowNull:false,
        type:Sequelize.STRING(255)
    }
  },
  {
    tableName: "header",
    timestamps: true,
  }
);

module.exports = Header;
