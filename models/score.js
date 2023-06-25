'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    
    static associate({ User, MessageData }) {
      this.belongsTo(User, {foreignKey: "userId"});
      this.belongsTo(MessageData, {foreignKey: "messageDataId"});
    }
  }
  Score.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    messageDataId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Score',
    tableName: 'scores'
  });
  return Score;
};