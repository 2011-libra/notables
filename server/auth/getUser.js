// We should also write a method that our app can use to fetch the logged-in user on our session. Our client will make this request every time the client application loads - this allows us to keep the user logged in on the client even after they refresh.

// Since passport attaches the session user to the request object, this should be straightforward as well.

const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.json(req.user);
});

module.exports = router;
