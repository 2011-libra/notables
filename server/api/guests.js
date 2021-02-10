const router = require('express').Router();
const {
  db,
  User,
  Document,
  UserDocument,
} = require('../db')

// matches GET requests to /api/guest
router.get('/:token', async function (req, res, next) {
  try {
    const targetDocument = await Document.findOne({
      where: {
        token: req.params.token
      }
    })
    res.json(targetDocument)
  } catch (error) {
    next(error)
  }
});

// matches POST requests to /api/guest
router.post('/', async function (req, res, next) {
  try {
    const newDocument = await Document.create(req.body)

    res.json(newDocument)
  } catch (error) {
    next(error)
  }
});

// matches PUT requests to /api/guest/:token
router.put('/:token', async function (req, res, next) {
  try {
    const targetDocument = await Document.findOne({where: {token: req.params.token}})
    await targetDocument.update(req.body)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
});

// matches DELETE requests to /api/guest/:token
router.delete('/:token', async function (req, res, next) {
  try {
    await Document.destroy({
      where: {
        token: req.params.token
      }
    })
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
});

module.exports = router;
