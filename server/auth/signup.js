// Once the user is created, it should be set as the user on the session.

const router = require('express').Router();

router.post('/', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    })
    .catch(next);
});

module.exports = router;
