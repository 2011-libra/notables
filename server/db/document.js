const Sequelize = require('sequelize');
const db = require('../db');

const Document = db.define('document', {
  contents: {
    type: Sequelize.TEXT
    // get() {
    //   return () => this.getDataValue('contents');
    // }
  },
  // salt: {
  //   type: Sequelize.STRING,
  //   get() {
  //     return () => this.getDataValue('salt');
  //   }
  // },
  token: {
    type: Sequelize.STRING,
    unique: true
    // allowNull: false
  }
});

module.exports = Document;
//   /**
//    * instanceMethods
//    */
//   Document.prototype.correctPassword = function (candidatePwd) {
//     return Document.encryptContents(candidatePwd, this.salt()) === this.password();
//   };

// /**
//  * classMethods
//  */
// Document.generateSalt = function () {
//   return crypto.randomBytes(16).toString('base64');
// };

// Document.encryptContents = function (plainText, salt) {
//   return crypto
//     .createHash('RSA-SHA256')
//     .update(plainText)
//     .update(salt)
//     .digest('hex');
// };

// /**
//  * hooks
//  */
// const setSaltAndPassword = user => {
//   if (user.changed('password')) {
//     user.salt = User.generateSalt();
//     user.password = User.encryptPassword(user.password(), user.salt());
//   }
// };

// User.beforeCreate(setSaltAndPassword);
// User.beforeUpdate(setSaltAndPassword);
// User.beforeBulkCreate(users => {
//   users.forEach(setSaltAndPassword);
// });

const generateToken = document => {
  const today = new Date();
  document.token = `${Math.ceil(
    Math.random() * (8888 - 0) + 0
  )}${today.getFullYear()}${today.getMonth()}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getMilliseconds()}`;
};

Document.beforeCreate(generateToken);
