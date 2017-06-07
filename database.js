const Sequelize = require('sequelize');

const connectionUrl = 'postgres://istoryuser:istorypass@localhost:5432/istoryup';

const database = new Sequelize(connectionUrl);

module.exports = database;
