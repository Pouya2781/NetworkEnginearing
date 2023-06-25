'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    
    static associate({ User, ContactChat, RumorChat }) {
      this.belongsTo(User, {foreignKey: "userId"});
      this.belongsTo(ContactChat, {foreignKey: "chatId"});
      this.belongsTo(RumorChat, {foreignKey: "chatId"});
    }
  }
  UserChat.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastViewedMessageId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currentScrollMessageId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'UserChat',
    tableName: 'userchats'
  });
  return UserChat;
};