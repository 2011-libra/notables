import React, { useState, useEffect } from 'react';
import './Texteditor.css';
import CodeBlock from './CodeBlock';
import { useSelector } from 'react-redux';
import Toolbar from './toolbar';
import socket from '../../socket'
let md = require('markdown-it')();
const DMP = require('diff-match-patch')
const dmp = new DMP()
const axios = require('axios');
const TurndownService = require('turndown').default;
let turndownService = new TurndownService();
turndownService.addRule('code-snippet', {
  filter: ['pre'],
  replacement: content => {
    return '```' + content.slice(1) + '```';
  }
});

function texteditor(props) {
  let keystroke = 0
  const [docToken, setDocToken] = useState(`insertTokenHere`)

  let importState = useSelector(state => state);
  let result = importState.import.result ? importState.import.result : '';
  let markdownResult = result;

  const convertFromMD = () => {
    return md
          .render(result)
          .replace(
            /<p><code>/g,
            `<pre class="codeBlock" id='codeBlock-TBD'><button id="codeBlock-TBD-button" class="run-code-button" contentEditable=false >▶</button>`
          )
          .replace(/<\/code><\/p>/g, `</pre>`);
  }

  if (result === '') {
    markdownResult = md.render(result);
  } else {
    markdownResult = convertFromMD()
  }

  const convertToMD = () => {
    let innerHTML = document.getElementById('contentEditable').innerHTML;
    let markdown = turndownService.turndown(innerHTML);
    return markdown
  };

  useEffect(() => {
      createCodeRunnerEvent();

      document
        .getElementById('contentEditable')
        .addEventListener('keydown', keyCounter)

  });

  socket.on(`${docToken}`, (message) => {
    let {contents} = message;
    console.log('before patch:', contents)
    const oldDocument = contents;
    const currDocument = convertToMD();
    const patches = dmp.patch_make(currDocument, oldDocument);
    const [newDocument, [success]] = dmp.patch_apply(patches, currDocument)

    if(success){
      result = newDocument;
      console.log('after patch:', newDocument)
      markdownResult = convertFromMD()
      document.getElementById('contentEditable').innerHTML = markdownResult
      createCodeRunnerEvent()
    }
  })

  function keyCounter () {
    if(keystroke < 10){
      keystroke++
    } else {
      let updatedContent = convertToMD()
      let message = {contents: updatedContent, token: docToken}
      socket.emit('update-document', message)
      keystroke = 0
    }
  }

  function createCodeRunnerEvent() {
    if (
      document
        .getElementById('contentEditable')
        .innerHTML.includes('class="codeBlock"') ||
      document
        .getElementById('contentEditable')
        .innerHTML.includes("class='codeBlock'")
    ) {
      const allCodeBlockNode = document.getElementsByClassName('codeBlock');
      const allRunCodeButtons = document.getElementsByClassName(
        'run-code-button'
      );

      for (let i = 0; i < allCodeBlockNode.length; i++) {
        allCodeBlockNode[i].id = 'codeBlock-' + i;
        allRunCodeButtons[i].id = 'codeBlock-' + i + '-button';
      }

      for (let i = 0; i < allRunCodeButtons.length; i++) {
        allRunCodeButtons[i].addEventListener('click', async () => {
          let runnableCode = document
            .getElementById(`codeBlock-${i}`)
            .innerText.replace('▶', '');

          if (document.getElementById(`stdout-for-${i}`)) {
            let outliers = document.getElementById(`stdout-for-${i}`).innerText;
            runnableCode = runnableCode.replace('▶', '').slice(0, -outliers.length);
          }

          const today = new Date();

          const stdout = await axios.post('/code', {
            code: runnableCode,
            token: `${Math.ceil(
              Math.random() * (8888 - 0) + 0
            )}${today.getFullYear()}${today.getMonth()}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getMilliseconds()}`
          });

          if (!document.getElementById(`stdout-for-${i}`)) {
            const outputNode = document.createElement('pre');
            outputNode.innerText = stdout.data;
            outputNode.id = `stdout-for-${i}`;
            outputNode.className = 'sandbox-stdout';
            outputNode.setAttribute('contentEditable', false);
            document.getElementById(`codeBlock-${i}`).appendChild(outputNode);
          } else {
            document.getElementById(`stdout-for-${i}`).innerText = stdout.data;
          }
        });
      }
    }
  }

  return (
    <div className="texteditor_container">
      {/* <div className="codeeditor_button">
        <button onClick={downloadTxtFile}>Export</button>
      </div> */}
      <Toolbar />
      <div
        className="editor"
        id="contentEditable"
        contentEditable="true"
        data-placeholder="Type your notes here!"
        dangerouslySetInnerHTML={
          result === '' ? { __html: '' } : { __html: markdownResult }
        }
      ></div>

      <div id="targetDiv"></div>
      {/* <CodeBlock /> */}
    </div>
  );
}

export default texteditor;
