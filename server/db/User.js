const Sequelize = require("sequelize");
const db = require("./database");
const crypto = require("crypto");

//Lodash is a JavaScript library which provides utility functions for common programming tasks using the functional programming paradigm.
const _ = require("lodash");

const User = db.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
    google_id: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: setSaltAndPassword,
      beforeUpdate: setSaltAndPassword,
    },
  }
);

// returns true or false if the entered password matches
User.prototype.correctPassword = function (candidatePassword) {
  return this.encryptPassword(candidatePassword, this.salt) === this.password;
};

// utilizes lodash package
User.prototype.sanitize = function () {
  // _.omit(obj, path) method used to create a new object by omitting properties from an existing object.
  return _.omit(this.toJSON(), ["password", "salt"]);
  // excludes the 'password' and 'salt' key-value pair from the new object being created
};

// Salting Hashes in cryptography refers to adding random data to the input of a hash function to guarantee a unique output
// generates a random salt
User.generateSalt = function () {
  return crypto.randomBytes(16).toString("base64");
};

// accepts a plain text password and a salt, and returns its hash
User.prototype.encryptPassword = function (plainText, salt) {
  const hash = crypto.createHash("sha1"); // crypto.createHash(algorithm[, options])
  // In cryptography, SHA-1 (Secure Hash Algorithm 1) is a cryptographic hash function which takes an input and produces a 160-bit (20-byte) hash value known as a message digest – typically rendered as a hexadecimal number, 40 digits long.

  hash.update(plainText); // hash.update(data[, inputEncoding])
  hash.update(salt);
  // 'hash.update()' updates the hash content with the given data, the encoding of which is given in inputEncoding. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.

  return hash.digest("hex"); // hash.digest([encoding])
  // Calculates the digest of all of the data passed to be hashed (using the hash.update() method).
};

function setSaltAndPassword(user) {
  // we need to salt and hash again when the user enters their password for the first time
  // and do it again whenever they change it
  if (user.changed("password")) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
}

module.exports = User;
