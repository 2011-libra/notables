const router = require('express').Router();
const sandbox = require('./sandbox');
const fs = require('fs');
const path = require('path');

const wrapCode = code => {
  return code;
  // return (
  //   `const { VM } = require('vm2');
  // const vm = new VM({
  //   timeout: 12000,
  //   sandbox: {}
  // });

  // const codeString = '` +
  //   code +
  //   `'

  // vm.run(codeString);
  // process.exit(1);
  // `
  // );
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

// Need a second variable to keep track of whether we're inside a
// string or not. If in string, ignore everything until string
// closes with correct character. If string doesn't close, ->F.

// A preprocessing step to make sure there are no unmatched
// quotes or brackets
const pairsMatch = string => {
  const opens = {
    '(': true,
    '[': true,
    '<': true,
    '{': true
  };
  const closes = {
    ')': '(',
    ']': '[',
    '>': '<',
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

router.post('/', async (req, res, next) => {
  const code = req.body.code;
  const token = req.body.token;
  if (pairsMatch(code)) {
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
  } else {
    res.send('Syntax error in code');
  }
});

module.exports = router;
