const { NodeVM } = require('vm2');
const codeObj = require('./code.json');

const vm = new NodeVM({
  console: 'inherit',
  sandbox: {}
});

try {
  vm.run('process = {}');
  vm.run(codeObj.code);
} catch (error) {
  console.log(error.toString());
}
process.exit(1);
