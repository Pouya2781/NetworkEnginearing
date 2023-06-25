'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    
    static associate({ User, MessageData, ChatData }) {
      this.belongsTo(User, {foreignKey: "userId"});
      this.belongsTo(MessageData, {foreignKey: "messageDataId"});

      this.hasOne(ChatData, {foreignKey: "messageId"});
    }
  }
  Message.init({
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
    modelName: 'Message',
    tableName: 'messages'
  });
  return Message;
};