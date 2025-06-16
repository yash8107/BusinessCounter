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
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            isActive: {
                type: DataTypes.ENUM('active', 'inactive'),
                defaultValue: 'active',
            },
            service_No: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            sac: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gst: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            total_Sprice:{
                type:DataTypes.FLOAT,
                allowNull:false
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            deletedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        }
    );

    return Services;
};
