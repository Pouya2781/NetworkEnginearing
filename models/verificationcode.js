'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VerificationCode extends Model {
    
    static associate(models) {
      
    }
  }
  VerificationCode.init({
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'VerificationCode',
    tableName: 'verificationcodes'
  });
  return VerificationCode;
};