'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    
    static associate({ User, Message, Reply, Forward, MessageData }) {
      this.belongsTo(User, {foreignKey: "userId"});
      this.belongsTo(Message, {foreignKey: "messageId"});
      this.belongsTo(Reply, {foreignKey: "messageId"});
      this.belongsTo(Forward, {foreignKey: "messageId"});
      this.belongsTo(MessageData, {foreignKey: "messageDataId"});
    }
  }
  Comment.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    messageDataId: {
      type: DataTypes.INTEGER,
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
    modelName: 'Comment',
    tableName: 'comments'
  });
  return Comment;
};