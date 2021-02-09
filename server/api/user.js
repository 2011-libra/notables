const router = require('express').Router();
const { db, User, Document, UserDocument } = require('../db');

/* ::::: PLEASE NOTE ::::: */
/* Passport's req.user should be used instead of "id". */
/* For testing purposes, req.params.id is being utilized for initial development purposes. */
// router.get('/', async (req, res, next) => {
//   try {
//     const users = await User.findAll({
//       attributes: ['email']
//     });
//     res.json(users);
//   } catch (err) {
//     next(err);
//   }
// });
// matches GET requests to /api/user
router.get('/:id', async function (req, res, next) {
  try {
    const userData = await User.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: Document
      },
      attributes: ['id', 'email']
    });
    res.json(userData);
  } catch (error) {
    next(error);
  }
});

// matches POST requests to /api/user/:id
router.post('/:id', async function (req, res, next) {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    const newDocument = await Document.create(req.body);
    // await Document.update({role: 'owner'}, {where: {id: newDocument.id}})
    await user.addDocument(newDocument.id);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// matches PUT requests to /api/user/:id
router.put('/:token', async function (req, res, next) {
  try {
    const targetDocument = await Document.findOne({
      where: { token: req.params.token }
    });
    await targetDocument.update(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// matches DELETE requests to /api/user/:id/:documentId
router.delete('/:id/:documentId', async function (req, res, next) {
  try {
    await Document.destroy({
      where: {
        id: req.params.documentId
      },
      include: {
        model: UserDocument
      }
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
