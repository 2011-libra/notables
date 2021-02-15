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

// Check that brackets match and there are no floating string delimiters
const pairsMatch = string => {
  const opens = {
    '(': true,
    '[': true,
    '{': true
  };
  const closes = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  const stringChars = {
    "'": true,
    '"': true,
    '`': true
  };
  const stack = [];
  let inString = '';

  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (!inString) {
      if (char === '\\') {
        return false;
      }
      if (stringChars[char]) {
        inString = char;
      } else if (opens[char]) {
        stack.push(char);
      } else if (closes[char]) {
        if (!stack.length) {
          return false;
        } else if (stack[stack.length - 1] === closes[char]) {
          stack.pop();
        } else {
          return false;
        }
      }
    } else if (char === inString) {
      inString = '';
    }
  }
  return stack.length === 0 && inString === '';
};

// POST /api/code/
router.post('/', async (req, res, next) => {
  const code = req.body.code;
  const token = req.body.token;
  if (pairsMatch(code)) {
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
  } else {
    console.log('[API Route] sandbox()  input:', chalk.red(code));
    res.send('Syntax problem with input');
  }
});

module.exports = router;
