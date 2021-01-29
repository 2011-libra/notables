const Sequelize = require('sequelize');
const db = require('./database');

const UserDocument = db.define('user_document', {
  role: {
    type: Sequelize.ENUM(['owner', 'collaborator', 'guest'])
  }
});

module.exports = UserDocument;
