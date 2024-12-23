import { Model, DataTypes } from "sequelize";

export default function(sequelize) {
  class User extends Model {
    static associate(models) {
      // Role association
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });

      // Admin has many staff members
      User.hasMany(models.StaffProfile, {
        foreignKey: 'admin_id',
        as: 'staffMembers'
      });
    }
  }

  User.init({
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
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        if (!user.business_name && user.first_name) {
          user.business_name = `${user.first_name}'s Business`;
        }
        if (!user.business_type) {
          user.business_type = 'Other';
        }
      }
    }
  });

  return User;
}