const router = require('express').Router();

// router.use('/users', require('./users'));
// router.use('/puppies', require('./puppies'));
// router.use('/kittens', require('./kittens'));

router.use(function(req,res, next){
  const err = new Error('Not found.');
  err.status = 404;
  next(err)
})

module.exports = router;
