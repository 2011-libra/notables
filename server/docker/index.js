const router = require('express').Router();
const sandbox = require('./sandbox');
const fs = require('fs');
const path = require('path')

router.post('/', async (req, res, next) => {
  const code = req.body.code
  let output = ''
  await fs.writeFile(path.join(__dirname, '/sample/code.js'), code, (err)=>{
    err ?
    console.log(err):
    console.log('[server/docker/index.js] File Written.')
    }
  );
  output = await sandbox()
  console.log('[server/docker/index.js] sandbox() output:', output)
  res.send(output);
})

module.exports = router;
