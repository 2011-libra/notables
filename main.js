const { db } = require("./server/db");
const app = require("./server");
const PORT = process.env.PORT || 8080;

db.sync().then(() => {
  console.log("DB has been synced");
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
