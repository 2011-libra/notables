// To log out, we need to destroy the user on our session. Passport makes this very easy by attaching a logout method to the request object.

const router = require('express').Router();

router.delete('/', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(204);
})

module.exports = router;
