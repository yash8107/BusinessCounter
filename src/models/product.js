import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default (sequelize) => {
    const Product = sequelize.define(
        'Product',
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
            sku: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            brand: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            basePrice: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            salePrice: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            currency: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantityInStock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            length: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            width: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            height: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            images: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            isActive: {
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
            },
            lowStockAlertThreshold:{
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
        }
    );

    return Product;
};
