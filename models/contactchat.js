'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactChat extends Model {
    
    static associate({ User, UserChat, ChatData }) {
      this.belongsTo(User, {foreignKey: "userId1", as: 'user1'});
      this.belongsTo(User, {foreignKey: "userId2", as: 'user2'});

      this.hasMany(UserChat, {foreignKey: "chatId"});
      this.hasMany(ChatData, {foreignKey: "chatId"});
    }
  }
  ContactChat.init({
    userId1: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ContactChat',
    tableName: 'contactchats'
  });
  return ContactChat;
};