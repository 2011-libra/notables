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

// Mounted on /api/users

// POST /api/users/ - Create new user
router.post('/', async function (req, res, next) {
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

// GET /api/users/:id - Retrieve user data
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

// PUT /api/users/:id - Update user data
router.put('/:id', async function (req, res, next) {
  // Need to refactor this to signify updating user info
  try {
    const targetDocument = await Document.findOne({
      where: { token: req.params.token }
    });
    const oldDocument = targetDocument.contents;
    const incomingDocument = req.body.contents; // Need to check this from form.
    const patches = dmp.patch_make(oldDocument, incomingDocument);
    const [newDocument, [success]] = dmp.patch_apply(patches, oldDocument);
    if (success) {
      await targetDocument.update({ contents: newDocument });
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Remove user data
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
