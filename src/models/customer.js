// src/models/customer.js
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default (sequelize) => {
  const Customer = sequelize.define('Customer', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    lastTransaction: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_providerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
          }
    }
  });

  return Customer;
};