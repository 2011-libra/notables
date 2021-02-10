const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/documents', require('./documents'));
// router.use('/guests', require('./guests'));

router.use(function (req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
});

module.exports = router;
