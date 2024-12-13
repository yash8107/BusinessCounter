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
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
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
      allowNull: true
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    business_type: {
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
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    created_by: {
      type: DataTypes.INTEGER,
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