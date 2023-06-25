'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    
    static associate({ User, MessageData, ChatData }) {
      this.belongsTo(User, {foreignKey: "userId"});
      this.belongsTo(MessageData, {foreignKey: "messageDataId", as: 'messageData'});
      this.belongsTo(MessageData, {foreignKey: "replyMessageDataId", as: 'replyMessageData'});

      this.hasOne(ChatData, {foreignKey: "messageId"});
    }
  }
  Reply.init({
    messageDataId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    replyMessageDataId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'replies'
  });
  return Reply;
};