import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default (sequelize) => {
    const Services = sequelize.define(
        'Services',
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: uuidv4,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            user_providerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            priceType: {
                type: DataTypes.STRING,
                allowNull: false, // fixed, hourly, daily, weekly, monthly, yearly
            },
            priceValue: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            currency: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isAvailable: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            createdAt:{
                type: DataTypes.DATE,
                allowNull: true,
            },
            updatedAt:{
                type: DataTypes.DATE,
                allowNull: true,
            }
        }
    );

    return Services;
};
