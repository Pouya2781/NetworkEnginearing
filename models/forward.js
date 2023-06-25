'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Forward extends Model {
   
    static associate({ User, MessageData, ChatData }) {
      this.belongsTo(User, {foreignKey: "userId"});
      this.belongsTo(MessageData, {foreignKey: "messageDataId"});

      this.hasOne(ChatData, {foreignKey: "messageId"});
    }
  }
  Forward.init({
    messageDataId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Forward',
    tableName: 'forwards'
  });
  return Forward;
};