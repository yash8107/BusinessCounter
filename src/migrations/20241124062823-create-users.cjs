'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deleted_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address_line1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address_line2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('users');
  }
};