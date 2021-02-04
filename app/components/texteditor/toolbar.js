import React, { useState } from 'react';
const ReactDOM = require('react-dom');
import CodeBlock from './CodeBlock';
const hljs = window.hljs;
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaLink,
  FaHeading,
  FaCode
} from 'react-icons/fa';
import './Texteditor.css';

export default function toolbar() {
  //BOLD, ITALICS, UNORDERED LISTS
  function format(com, val) {
    document.execCommand(com, false, val);
  }
  //SUPPOSE TO ADD LINKS
  function addLink() {
    const show = document.getElementById('url-input');
    if (show.classList.contains('hidden')) {
      show.classList.remove('hidden');
    } else {
      show.classList.add('hidden');
    }
  }
  //SETTING URLS
  function setUrl(e) {
    e.preventDefault();
    const url = document.getElementById('txtFormatUrl').value;
    const show = document.getElementById('url-input');
    const text = document.getSelection();
    format(
      'insertHTML',
      `<a href='${url}' target='_blank'>${text}
    </a>`
    );
    document.getElementById('txtFormatUrl').value = '';
    show.classList.add('hidden');
  }

  /*****************/
  /*** CODEBLOCK ***/
  function addCodeBlock() {
    const codeBlock = document.createElement('pre');
    const target = document.getSelection();
    if ( //prevents nesting and code block insertion inside invalid nodes
      target.focusNode.nodeName.includes('#text') ||
      target.focusNode.classList.contains('title') ||
      target.focusNode.className.includes('codeBlock') ||
      target.focusNode.className.includes('code-blocks')
    ) {
      return;
    }
    // creating unique 'id' for each code-block
    const id = `codeBlock-${
      document.getElementsByClassName('codeBlock').length + 1
    }`;
    codeBlock.classList.add('codeBlock');

    format('insertHTML', `<pre class='codeBlock' id='${id}' tabindex=0><button id="${id}-button"contentEditable=false >▶</button>${target} </pre>`);
    addLineAfterBlock(id);

    document.getElementById(`${id}-button`).addEventListener('click', ()=>{
      const runnableCode = document.getElementById(`${id}`).innerText.slice(1)

    })
  }




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

  return (
    <div className="toolbar">
      <select
        onChange={e => {
          if (e.target.value === '1') {
            const target = document.getSelection();
            format('insertHTML', `<h1>${target}</h1>`);
          } else if (e.target.value === '2') {
            const target = document.getSelection();
            format('insertHTML', `<h2>${target}</h2>`);
          }
        }}
      >
        <option>Select a heading</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
      </select>

      <button onClick={e => format('bold')}>
        <FaBold />
      </button>
      <button onClick={e => format('italic')}>
        <FaItalic />
      </button>
      <button onClick={e => format('insertUnorderedList')}>
        <FaListUl />
      </button>
      <button onClick={e => format('insertOrderedList')}>
        <FaListOl />
      </button>
      <button onClick={e => addLink()}>
        <FaLink />
      </button>
      <div id="url-input" className="hidden">
        <input id="txtFormatUrl" placeholder="url" />
        <button onClick={e => setUrl(e)}>Create Link</button>
      </div>

      <button onClick={e => addCodeBlock()}>
        <FaCode />
      </button>
    </div>
  );
}

