// The purpose of this module is to bring your Sequelize instance (`db`) together with your models

const db = require("./database");
const User = require("./user");
const Document = require("./document");
const UserDocument = require("./user_document");

User.belongsToMany(Document, { through: "user_document" });
Document.belongsToMany(User, { through: "user_document" });

module.exports = {
  db,
  User,
  Document,
  UserDocument,
};
