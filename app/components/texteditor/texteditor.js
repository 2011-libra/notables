import React, { useEffect } from 'react';
import './Texteditor.css';
import CodeBlock from './CodeBlock';
import { useSelector } from 'react-redux';
import Toolbar from './toolbar';
const axios = require('axios');
const TurndownService = require('turndown').default;
let md = require('markdown-it')();

function texteditor(props) {
  let importState = useSelector(state => state);
  let result = importState.import.result ? importState.import.result : '';
  let markdownResult = result;

  if (result === '') {
    markdownResult = md.render(result);
  } else {
    markdownResult = md
      .render(result)
      .replace(/<p><code>/g, `<pre class="codeBlock" id='codeBlock-TBD'>`)
      .replace(
        /<\/code><\/p>/g,
        `</pre><button id="TBD-button" class="run-code-button" contentEditable=false placeholder="add your code here...">▶ Run Code</button>`
      );
  }

  useEffect(() => {
    createCodeRunnerEvent();

    onkeydown = e => {
      if (
        document.getSelection().anchorNode.parentElement.localName === 'pre' ||
        document.getSelection().anchorNode.localName === 'pre'
      ) {
        if (e.key === 'Enter' || e.code === 'Enter') {
          e.preventDefault();
          return;
        }
      }
    };
  });

  //**//**//**//**//**//**
  //** LOCAL STORAGE//**
  //**//**//**//**//**
  // let localDoc = document.getElementById('contentEditable');

  setInterval(function () {
    localStorage['doc'] = document.getElementById('contentEditable').innerHTML;
  }, 1000);

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
          if (
            document.getElementById(`codeBlock-${i}`).innerText.trim() === '' ||
            document.getElementById(`codeBlock-${i}`).innerText.length < 2
          ) {
            alert(
              'Unable to "Run Code" if code block is empty, or less than 2 charaters long.'
            );
            return;
          }

          let runnableCode = document
            .getElementById(`codeBlock-${i}`)
            .innerText.replace('▶', '');

          if (document.getElementById(`stdout-for-${i}`)) {
            let outliers = document.getElementById(`stdout-for-${i}`).innerText;
            runnableCode = runnableCode
              .replace('▶', '')
              .slice(0, -outliers.length);
          }

          const today = new Date();

          document.getElementById(`codeBlock-${i}-button`).disabled = true;

          setTimeout(() => {
            // fail-safe
            document.getElementById(`codeBlock-${i}-button`).disabled = false;
          }, 8000);

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
          setTimeout(() => {
            document.getElementById(`codeBlock-${i}-button`).disabled = false;
          }, 2000);
        });
      }
    }
  }

  return (
    <div className="texteditor_container">
      <Toolbar />
      <div
        className="editor"
        id="contentEditable"
        contentEditable="true"
        data-placeholder="Type your notes here!"
        dangerouslySetInnerHTML={
          result === ''
            ? { __html: localStorage.doc }
            : { __html: markdownResult }
        }
      ></div>

      <div id="targetDiv"></div>
      {/* <CodeBlock /> */}
    </div>
  );
}

export default texteditor;
