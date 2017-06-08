const Sequelize = require('sequelize');

const connectionUrl = 'postgres://hisgotuser:hisgotpass@localhost:5432/hisgot';

const database = new Sequelize(connectionUrl);

module.exports = database;
