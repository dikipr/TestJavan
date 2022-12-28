'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

require('dotenv').config();

let sequelize;
sequelize = new Sequelize(process.env.SEQUELIZE_DB,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT,
    logging: process.env.NODE_ENV === "production" ? false : (data) => console.log(data),
    pool: {
      max: process.env.SEQUELIZE_POOL_CONNECTION ? parseInt(process.env.SEQUELIZE_POOL_CONNECTION) : 5,
      min: 0,
      idle: process.env.SEQUELIZE_POOL_MAXIDLETIME ? parseInt(process.env.SEQUELIZE_POOL_MAXIDLETIME) : 10000
    },
    dialectOptions: {
      connectTimeout: process.env.SEQUELIZE_CONNECTTIMEOUT ? parseInt(process.env.SEQUELIZE_CONNECTTIMEOUT) : 10000,
    },
  },
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    // const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
