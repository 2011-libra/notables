import React, { useState, useEffect } from 'react';
import './Texteditor.css';
import CodeBlock from './CodeBlock';
import { useSelector } from 'react-redux';
import Toolbar from './toolbar';
const axios = require('axios');
const TurndownService = require('turndown').default;
let md = require('markdown-it')();

function texteditor(props) {
  // const { result } = props;
  let importState = useSelector(state => state);
  let result = importState.import.result ? importState.import.result : '';
  let markdownResult = result;
  // console.log(result);

  if (result === '') {
    markdownResult = md.render(result);
  } else {
    markdownResult = md
      .render(result)
      .replace(
        /<p><code>/g,
        `<pre class="codeBlock" id='codeBlock-TBD'><button id="codeBlock-TBD-button" class="run-code-button" contentEditable=false >▶</button>`
      )
      .replace(/<\/code><\/p>/g, `</pre>`);
  }

  // const downloadTxtFile = () => {
  //   let innerHTML = document.getElementById('contentEditable').innerHTML;
  //   let turndownService = new TurndownService();
  //   let markdown = turndownService.turndown(innerHTML);

  //   const element = document.createElement('a');
  //   const file = new Blob([markdown], {
  //     type: 'text/richtext;charset=utf-8'
  //   });
  //   element.href = URL.createObjectURL(file);
  //   element.download = 'myFile.txt';
  //   document.body.appendChild(element);
  //   element.click();
  // };

  useEffect(() => {
    createCodeRunnerEvent();
  });

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
            .innerText.slice(1);

          if (document.getElementById(`stdout-for-${i}`)) {
            let outliers = document.getElementById(`stdout-for-${i}`).innerText;
            runnableCode = runnableCode.slice(1, -outliers.length);
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
