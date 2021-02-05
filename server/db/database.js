// The sole purpose of this module is to establish a connection to your
// Postgres database by creating a Sequelize instance (called `db`).

const Sequelize = require('sequelize');

// const db = new Sequelize('capstone', 'guest', 'password', {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging: false
// });

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/capstone`,
  { logging: false }
);

module.exports = db;
