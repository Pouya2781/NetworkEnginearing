'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('chatdata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      chatType: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('chatdata');
  }
};