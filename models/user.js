'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {

    static associate({MessageData, Message, Reply, Forward, Comment, View, Score, UserChat, ContactChat}) {
      this.hasMany(MessageData, {foreignKey: "userId"});
      this.hasMany(Message, {foreignKey: "userId"});
      this.hasMany(Reply, {foreignKey: "userId"});
      this.hasMany(Forward, {foreignKey: "userId"});
      this.hasMany(Comment, {foreignKey: "userId"});
      this.hasMany(View, {foreignKey: "userId"});
      this.hasMany(Score, {foreignKey: "userId"});
      this.hasMany(UserChat, {foreignKey: "userId"});
      this.hasMany(ContactChat, {foreignKey: "userId1"});
      this.hasMany(ContactChat, {foreignKey: "userId2"});
    }
  }
  user.init({
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return user;
};