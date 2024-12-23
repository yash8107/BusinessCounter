'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_provider_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      company_registration_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      tax_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      company_address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      company_phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      company_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      support_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      support_phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true
      },
      service_areas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
      },
      license_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      subscription_plan: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Enterprise'
      },
      subscription_status: {
        type: DataTypes.ENUM('active', 'inactive', 'expired'),
        allowNull: false,
        defaultValue: 'active'
      },
      subscription_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
        allowNull: false
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('service_provider_profiles');
  }
};