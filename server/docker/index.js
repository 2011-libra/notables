const router = require('express').Router();
const sandbox = require('./sandbox');
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res, next) => {
  const code = req.body.code;
  const token = req.body.token;
  let output = 'default';
  await fs.mkdir(path.join(__dirname, `/${token}`), err => {
    if (err) {
      return console.error(err);
    }
    console.log('Directory created successfully!');
  });
  await fs.copyFile(
    path.join(__dirname, '/Dockerfile'),
    path.join(__dirname, `/${token}/Dockerfile`),
    err => {
      if (err) {
        return console.error(err);
      }
      console.log('Docker file copied successfully!');
    }
  );
  await fs.writeFile(path.join(__dirname, `/${token}/code.js`), code, err => {
    err
      ? console.log(err)
      : console.log('[server/docker/index.js] File Written.');
  });

  output = await sandbox(token);
  console.log('[API Route] sandbox() output:', output);

  // await fs.rmdir(
  //   path.join(__dirname, `/${token}`),
  //   {recursive: true},
  //   err => {
  //     if (err) {
  //       return console.error(err);
  //     }
  //     console.log('Directory Deleted!');
  //   }
  // )

  res.send(output);
});

module.exports = router;
