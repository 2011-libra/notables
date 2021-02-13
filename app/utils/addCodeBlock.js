const axios = require('axios');
import format from './format';
import insertAfter from './insertAfter';

function addLineAfterBlock(id) {
  const block = document.getElementById(`${id}`);
  const div = document.createElement('div');
  const br = document.createElement('br');
  div.appendChild(br);

  if (!block) {
    return;
  } else {
    block.after(div);
  }
}

export default function addCodeBlock() {
  const codeBlock = document.createElement('pre');
  const target = document.getSelection();
  if (
    // target.anchorNode.localName === 'div' ||
    target.anchorNode === null ||
    target.anchorNode.localName === 'a' ||
    target.focusNode.nodeName.includes('#text') ||
    target.focusNode.classList.contains('title') ||
    target.focusNode.className.includes('codeBlock') ||
    target.focusNode.className.includes('code-blocks')
  ) {
    alert(
      'To add a code block, please start on a new line inside the text area. NOTE: Inline code blocks are not premitted.'
    );
    return;
  }

  const id = `codeBlock-${
    document.getElementsByClassName('codeBlock').length + 1
  }`;
  codeBlock.classList.add('codeBlock');

  format(
    'insertHTML',
    `<pre class='codeBlock' id='${id}' placeholder="add your code here...">${target}</pre>`
  );
  let newCodeBlock = document.getElementById(id);
  let runButton = document.createElement('button');
  runButton.id = `${id}-button`;
  runButton.className = 'run-code-button';
  runButton.contentEditable = false;
  runButton.innerText = '▶ Run Code';
  insertAfter(runButton, newCodeBlock);
  addLineAfterBlock(`${id}-button`);

  //set caret position here
  let setPosition = document.createRange();
  let targetPosition = document.getElementById(`${id}`);
  setPosition.setStart(targetPosition, 0);
  setPosition.collapse(true);
  target.removeAllRanges();
  target.addRange(setPosition);
  targetPosition.focus();

  document
    .getElementById(`${id}-button`)
    .addEventListener('click', async () => {
      let runnableCode = document.getElementById(`${id}`).innerText;

      if (
        document.getElementById(`${id}`).innerText.trim() === '' ||
        document.getElementById(`${id}`).innerText.length < 2
      ) {
        alert(
          'Unable to "Run Code" if code block is empty, or less than 2 charaters long.'
        );
        return;
      }

      if (document.getElementById(`stdout-for-${id}`)) {
        let outliers = document.getElementById(`stdout-for-${id}`).innerText;
        runnableCode = runnableCode.slice(0, -outliers.length);
      }

      const today = new Date();

      document.getElementById(`${id}-button`).disabled = true;

      setTimeout(() => {
        // fail-safe
        document.getElementById(`${id}-button`).disabled = false;
      }, 8000);

      const stdout = await axios.post('/code', {
        code: runnableCode,
        token: `${Math.ceil(
          Math.random() * (8888 - 0) + 0
        )}${today.getFullYear()}${today.getMonth()}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getMilliseconds()}`
      });

      if (!document.getElementById(`stdout-for-${id}`)) {
        const outputNode = document.createElement('pre');
        outputNode.innerText = stdout.data;
        outputNode.id = `stdout-for-${id}`;
        outputNode.className = 'sandbox-stdout';
        outputNode.setAttribute('contentEditable', false);
        document.getElementById(`${id}`).appendChild(outputNode);
      } else {
        document.getElementById(`stdout-for-${id}`).innerText = stdout.data;
      }
      setTimeout(() => {
        document.getElementById(`${id}-button`).disabled = false;
      }, 2000);
    });
}
