// The sole purpose of this module is to establish a connection to your
// Postgres database by creating a Sequelize instance (called `db`).

const Sequelize = require('sequelize');

const db = new Sequelize('capstone', 'guest', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = db;
