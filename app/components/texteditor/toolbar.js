import React, { useState } from 'react';
import axios from 'axios';
import { fetchCode } from '../../redux/CodeEditor';
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
  /******************************/
  /*** EXECCOMMAND FORMATTING ***/
  /******************************/
  //BOLD, ITALICS, UNORDERED LISTS, ETC.
  function format(com, val) {
    document.execCommand(com, false, val);
  }

  /*****************/
  /*** HYPERLINK ***/
  /*****************/
  function addLink() {
    const show = document.getElementById('url-input');
    if (show.classList.contains('hidden')) {
      show.classList.remove('hidden');
    } else {
      show.classList.add('hidden');
    }
  }

  /*******************/
  /*** SETTING URL ***/
  /*******************/
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

  /**********************************/
  /*** RUNNABLE CODEBLOCK/SNIPPET ***/
  /**********************************/
  function addCodeBlock() {
    const codeBlock = document.createElement('pre');
    const target = document.getSelection();
    if (
      target.focusNode.nodeName.includes('#text') ||
      target.focusNode.classList.contains('title') ||
      target.focusNode.className.includes('codeBlock') ||
      target.focusNode.className.includes('code-blocks')
    ) {
      return;
    }

    const id = `codeBlock-${
      document.getElementsByClassName('codeBlock').length + 1
    }`;
    codeBlock.classList.add('codeBlock');

    format(
      'insertHTML',
      `<pre class='codeBlock' id='${id}'><button id="${id}-button" class="run-code-button" contentEditable=false >▶</button>${target} </pre>`
    );

    addLineAfterBlock(id);

    document
      .getElementById(`${id}-button`)
      .addEventListener('click', async () => {
        let runnableCode = document.getElementById(`${id}`).innerText.slice(1);

        if (document.getElementById(`stdout-for-${id}`)) {
          let outliers = document.getElementById(`stdout-for-${id}`).innerText;
          runnableCode = runnableCode.slice(1, -outliers.length);
        }

        const today = new Date();

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
      });

    // document.getElementById(`${id}-wrapper`).addEventListener('click', (e) => {
    //   console.log('keypressed!', e.path[0].innerHTML)
    // })
  }

  /**********************/
  /*** ADD LINE BREAK ***/
  /**********************/
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
          } else if (e.target.value === '0') {
            const target = document.getSelection();
            format('insertHTML', `<p>${target}</p>`);
          }
        }}
      >
        <option>Select a heading</option>
        <option value="0">Normal</option>
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
