'use strict';

import { readdirSync } from 'fs';
import { basename as _basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import Sequelize from 'sequelize';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(join(__dirname, '/../config/config.json'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  });
}

// Initialize db object with sequelize instances
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Test the connection
await sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Import and initialize models
const modelFiles = readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file !== 'index.js'
    );
  });

// Initialize models
for (const file of modelFiles) {
  const modelPath = new URL(join('file:', '', __dirname, file), import.meta.url);
  const modelModule = await import(modelPath);
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Run associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
