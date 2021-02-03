const router = require('express').Router();
const sandbox = require('./sandbox');
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res, next) => {
  try {
    const code = req.body.code;
    const token = req.body.token;
    let output = 'default';
    fs.mkdirSync(path.join(__dirname, `/${token}`), err => {
      if (err) {
        console.log('MKDIR ERROR');
        return console.error(err);
      }
      console.log('Directory created successfully!');
    });

    fs.writeFileSync(path.join(__dirname, `/${token}/code.js`), code, err => {
      err
        ? console.log('WRITEFILE ERR:', err)
        : console.log('[server/docker/index.js] File Written.');
    });

    output = await sandbox(token);
    console.log('[API Route] sandbox() output:', output);

    fs.rmdirSync(
      path.join(__dirname, `/${token}`),
      { recursive: true },
      err => {
        if (err) {
          return console.error('rmdir error:', err);
        }
        console.log('Directory Deleted!');
      }
    );

    res.send(output);
  } catch (error) {
    console.log('post error:', error);
  }
});

module.exports = router;
