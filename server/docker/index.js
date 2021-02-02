const router = require('express').Router();
const sandbox = require('./sandbox');
const fs = require('fs');
const path = require('path')

router.post('/', async (req, res, next) => {
  const code = req.body.code
  let output = ''
  await fs.writeFile(path.join(__dirname, '/sample/code.js'), await code, async ()=>{
    output = await sandbox()
  });
  res.send(output);
})

module.exports = router;
