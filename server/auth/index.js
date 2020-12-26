const router = require('express').Router();

// mounted on /auth/
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/signup', require('./signup'));
router.use('/userProfile', require('./getUser'));
router.use('/google', require('./google-oauth'));


router.use(function(req,res, next){
  const err = new Error('Not found.');
  err.status = 404;
  next(err)
})

module.exports = router;
