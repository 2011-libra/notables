const router = require('express').Router();
const { db, User, Document, UserDocument } = require('../db');
const DMP = require('diff-match-patch');
const dmp = new DMP();

// Need to add authentication checks as middleware: Do we have permission to do this?

// Mounted on /api/documents

// POST /api/documents/ - Create new document
router.post('/', async function (req, res, next) {
  try {
    const user = await User.findOne({
      where: { id: req.params.id }
    });
    const newDocument = await Document.create({
      contents: req.body.contents
    });
    await user.addDocument(newDocument.id);

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

// GET /api/documents/:token - Retrieve document
router.get('/:token', async function (req, res, next) {
  try {
    const targetDocument = await Document.findOne({
      where: { token: req.params.token }
    });
    res.send(targetDocument.contents);
  } catch (error) {
    next(error);
  }
});

// PUT /api/documents/:token - Update a document
router.put('/:token', async function (req, res, next) {
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
      throw new Error('Failed to update document, please try again');
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/documents/:token - Remove a document
router.delete('/:token', async function (req, res, next) {
  try {
    await Document.destroy({
      where: { token: req.params.token },
      include: { model: UserDocument }
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
