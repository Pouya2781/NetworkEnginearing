'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('messagedata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messagedata');
  }
};