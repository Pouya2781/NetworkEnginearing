'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatData extends Model {

    static associate({ Message, Reply, Forward, ContactChat, RumorChat }) {
      this.belongsTo(Message, {foreignKey: "messageId"});
      this.belongsTo(Reply, {foreignKey: "messageId"});
      this.belongsTo(Forward, {foreignKey: "messageId"});
      this.belongsTo(ContactChat, {foreignKey: "chatId"});
      this.belongsTo(RumorChat, {foreignKey: "chatId"});
    }
  }
  ChatData.init({
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    messageType: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ChatData',
    tableName: 'chatdata'
  });
  return ChatData;
};