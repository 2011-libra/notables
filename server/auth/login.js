//Here is an example that assumes a req.body that contains identifying key-value pairs (like an email field), and that users have some instance method to evaluate the password on req.body.

const router = require("express").Router();
const { User } = require("../db");

router.put("/", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) res.status(401).send("User not found");
    else if (!user.correctPassword(req.body.password))
      res.status(401).send("Incorrect password");
    else {
      req.login(user, (err) => {
        if (err) next(err);
        else res.json({ id: user.id, email: user.email });
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
