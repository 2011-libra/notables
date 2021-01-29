//Here is an example that assumes a req.body that contains identifying key-value pairs (like an email field), and that users have some instance method to evaluate the password on req.body.

const router = require('express').Router();

router.put('/', (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) res.status(401).send('User not found');
      else if (!user.hasMatchingPassword(req.body.password)) res.status(401).send('Incorrect password');
      else {
        req.login(user, err => {
          if (err) next(err);
          else res.json(user);
        });
      }
    })
    .catch(next);
});

module.exports = router;
