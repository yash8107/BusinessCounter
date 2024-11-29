import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class ServiceProviderProfile extends Model {
    static associate(models) {
      ServiceProviderProfile.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });
    }
  }

  ServiceProviderProfile.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true
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
    }
  }, {
    sequelize,
    modelName: 'ServiceProviderProfile',
    tableName: 'service_provider_profiles',
    timestamps: true,
    paranoid: true
  });

  return ServiceProviderProfile;
};
