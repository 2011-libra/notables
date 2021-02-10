const router = require('express').Router();
const { db, User, Document, UserDocument } = require('../db');

/* ::::: PLEASE NOTE ::::: */
/* Passport's req.user should be used instead of "id". */
/* For testing purposes, req.params.id is being utilized for initial development purposes. */

// Mounted on /api/users

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

// POST /api/users/ - Create new user
router.post('/', async function (req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(201).send({
      id: user.id,
      email: user.email
    });
  } catch (error) {
    if (error.errors[0].validatorKey === 'not_unique') {
      error.message = 'An account using this e-mail address already exists.';
    }
    next(error);
  }
});

// GET /api/users/:id - Retrieve user data
router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: Document
      },
      attributes: ['id', 'email']
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id - Update user data
router.put('/:id', async function (req, res, next) {
  // Need to refactor this to signify updating user info
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'email']
    });
    await user.update(req.body);
    res.send({
      id: user.id,
      email: user.email
    });
  } catch (error) {
    if (error.errors[0].validatorKey === 'not_unique') {
      error.message = 'An account using this e-mail address already exists.';
    }
    next(error);
  }
});

// DELETE /api/users/:id - Remove user data
router.delete('/:id', async function (req, res, next) {
  try {
    await User.destroy({
      where: {
        id: req.params.id
      },
      include: {
        model: UserDocument
      }
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
