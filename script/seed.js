const { db, User } = require("../server/db");

const seed = async () => {
  try {
    await db.sync({
      force: true,
    });
    console.log("db synced");
    await User.create({
      email: "cody@email.com",
      password: "12345",
    });
    console.log("user created");
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    console.log("db seeded!");
  }
};

seed();

module.exports = seed;
