'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageData extends Model {
    
    static associate({ User, Message, Reply, Forward, RumorChat, View, Score, Comment }) {
      this.belongsTo(User, {foreignKey: "userId"});

      this.hasOne(Message, {foreignKey: "messageDataId"});
      this.hasMany(Reply, {foreignKey: "messageDataId"});
      this.hasOne(Reply, {foreignKey: "replyMessageDataId"});
      this.hasMany(Forward, {foreignKey: "messageDataId"});
      this.hasOne(RumorChat, {foreignKey: "messageDataId"});
      this.hasMany(View, {foreignKey: "messageDataId"});
      this.hasMany(Score, {foreignKey: "messageDataId"});
      this.hasMany(Comment, {foreignKey: "messageDataId"});
    }
  }
  MessageData.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    score:{
      type: DataTypes.FLOAT,
      allowNull: true
    },
    scoreCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    replyCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    forwardCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    commentCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isRepliable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isForwardable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isCommentable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isScorable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isViewable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isRedirectable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MessageData',
    tableName: 'messagedata'
  });
  return MessageData;
};