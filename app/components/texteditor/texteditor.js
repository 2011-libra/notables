import React, { useState, useEffect } from 'react';
import keyboardRules from '../../utils/keyboard-rules';
import createCodeRunnerEvent from '../../utils/createCodeRunnerEvent'
import './Texteditor.css';
import { useSelector } from 'react-redux';
import Toolbar from './toolbar';
import autoSave from '../../utils/auto-save';
const axios = require('axios');
let md = require('markdown-it')();

function texteditor() {
  let importState = useSelector(state => state);
  let result = importState.import.result ? importState.import.result : '';
  let markdownResult = result;
  console.log(result);

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
    autoSave(result);
    keyboardRules();
  });

  return (
    <div className="texteditor_container">
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
    </div>
  );
}

export default texteditor;
