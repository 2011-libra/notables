const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/guest', require('./guest'));

router.use(function(req,res, next){
  const err = new Error('Not found.');
  err.status = 404;
  next(err)
})

module.exports = router;
