const router = require('express').Router();
const sandbox = require('./sandbox');
const fs = require('fs');
const path = require('path');

const wrapCode = code => {
  return (
    `const { VM } = require('vm2');
  const vm = new VM();

  const codeString = '` +
    code +
    `'

  vm.run(codeString);
  process.exit(1);
  `
  );
};

const makeWorkingDir = (token, code) => {
  try {
    fs.mkdirSync(path.join(__dirname, `/${token}`));
  } catch (error) {
    console.log('Error in mkDir:', error);
  }

  try {
    const wrappedCode = wrapCode(code);
    fs.writeFileSync(path.join(__dirname, `/${token}/code.js`), wrappedCode);
  } catch (error) {
    console.log('Error in writeFile:', error);
  }
};

const cleanupWorkingDir = token => {
  try {
    fs.rmdirSync(path.join(__dirname, `/${token}`), { recursive: true });
  } catch (error) {
    console.log('Error in cleanupWorkingDir:', error);
  }
};

router.post('/', async (req, res, next) => {
  const code = req.body.code;
  const token = req.body.token;

  try {
    makeWorkingDir(token, code);
    const output = await sandbox(token);
    console.log('[API Route] sandbox() output:', output);

    res.send(output);
  } catch (error) {
    next(error);
  } finally {
    cleanupWorkingDir(token);
  }
});

module.exports = router;
