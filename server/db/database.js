// The sole purpose of this module is to establish a connection to your
// Postgres database by creating a Sequelize instance (called `db`).

const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/yourdbname', {
  logging: false // unless you like the logs
  // ...and there are many other options you may want to play with
});

module.exports = db;
