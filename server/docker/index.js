const router = require('express').Router();
const sandbox = require('./sandbox');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');

// Create a temporary directory to store client code to run
const makeWorkingDir = (token, codeObj) => {
  try {
    fs.mkdirSync(path.join(__dirname, `/tmp/${token}`));
  } catch (error) {
    console.log('Error in mkDir:', error);
  }

  // Store client code within a JSON file
  try {
    fs.writeFileSync(
      path.join(__dirname, `/tmp/${token}/code.json`),
      JSON.stringify(codeObj)
    );
  } catch (error) {
    console.log('Error in writeFile:', error);
  }
};

// Remove working directory when code is finished
const cleanupWorkingDir = token => {
  try {
    rimraf.sync(path.join(__dirname, `./tmp/${token}`));
  } catch (error) {
    console.log('Error in cleanupWorkingDir:', error);
  }
};

// POST /api/code/
router.post('/', async (req, res, next) => {
  const code = req.body.code;
  const token = req.body.token;
  try {
    makeWorkingDir(token, { code });
    console.log('[API Route] sandbox()  input:', chalk.yellow(code));
    const output = await sandbox(token);
    console.log('[API Route] sandbox() output:', chalk.blue(output));

    res.send(output);
  } catch (error) {
    next(error);
  } finally {
    cleanupWorkingDir(token);
  }
});

module.exports = router;
