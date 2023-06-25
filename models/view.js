'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class View extends Model {
    
    static associate({ User, MessageData }) {
      this.belongsTo(User, {foreignKey: "userId"});
      this.belongsTo(MessageData, {foreignKey: "messageDataId"});
    }
  }
  View.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    messageDataId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'View',
    tableName: 'views'
  });
  return View;
};