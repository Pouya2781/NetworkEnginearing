'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RumorChat extends Model {
    
    static associate({ MessageData, UserChat, ChatData }) {
      this.belongsTo(MessageData, {foreignKey: "messageDataId"});

      this.hasMany(UserChat, {foreignKey: "chatId"});
      this.hasMany(ChatData, {foreignKey: "chatId"});
    }
  }
  RumorChat.init({
    messageDataId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'RumorChat',
    tableName: 'rumorchats'
  });
  return RumorChat;
};