import React, { useState, useEffect } from 'react';
import Popover from '@material-ui/core/Popover';
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
  let hyperlinkSelection = '';

  useEffect(() => {
    if (document.getElementById('txtFormatUrl')) {
      document.getElementById('txtFormatUrl').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          setUrl(e);
        }
      });
    }
  });

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
    if (
      document.getSelection().anchorNode === null ||
      document.getSelection().anchorNode.innerText === ''
    ) {
      console.log('condition is met');
      <Popover>
        {console.log('inside popover')}The content of the Popover.
      </Popover>;
      console.log('after popover');
      return;
    }

    hyperlinkSelection = document.getSelection().anchorNode;
    if (document.getSelection().anchorNode.parentElement.localName === 'pre') {
      alert('You can not add a hyperlink inside a code block');
      return;
    }

    const hypNode = document.getElementById('url-input');
    if (hypNode.classList.contains('hidden')) {
      hypNode.classList.remove('hidden');
    } else {
      hypNode.classList.add('hidden');
    }
  }

  /*******************/
  /*** SETTING URL ***/
  /*******************/
  function setUrl(e) {
    e.preventDefault();
    if (document.getSelection().anchorNode.parentElement.localName === 'pre') {
      return;
    }
    document.getElementById('url-input').className = 'hidden';
    const url = document.getElementById('txtFormatUrl').value;
    if (url === '') {
      return;
    }
    let currSelection = hyperlinkSelection;
    let currStr = currSelection.data;
    let newHyperlink = document.createElement('a');
    newHyperlink.innerText = currStr;
    newHyperlink.href = `https://${url}`;
    newHyperlink.target = '_blank';
    newHyperlink.contentEditable = false;
    currSelection.parentNode.insertBefore(newHyperlink, currSelection);
    currSelection.parentNode.removeChild(currSelection);
  }

  /**********************************/
  /*** RUNNABLE CODEBLOCK/SNIPPET ***/
  /**********************************/
  function addCodeBlock() {
    const codeBlock = document.createElement('pre');
    const target = document.getSelection();
    if (
      target.anchorNode === null ||
      target.focusNode.id !== 'contentEditable' ||
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
      `<pre class='codeBlock' id='${id}'><button id="${id}-button" class="run-code-button" contentEditable=false placeholder="add your code here...">▶</button>${target} </pre>`
    );

    addLineAfterBlock(id);

    document
      .getElementById(`${id}-button`)
      .addEventListener('click', async () => {
        let runnableCode = document
          .getElementById(`${id}`)
          .innerText.replace('▶', '');

        if (document.getElementById(`stdout-for-${id}`)) {
          let outliers = document.getElementById(`stdout-for-${id}`).innerText;
          runnableCode = runnableCode
            .replace('▶', '')
            .slice(0, -outliers.length);
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
          if (
            document.getSelection().anchorNode.parentElement.localName === 'pre'
          ) {
            return;
          }
          if (e.target.value === '1') {
            const target = document.getSelection();
            format('insertHTML', `<h1>${target}</h1>`);
          } else if (e.target.value === '2') {
            const target = document.getSelection();
            format('insertHTML', `<h2>${target}</h2>`);
          }
          //This code is manually changing the current tags and replacing it with p tags
          if (e.target.value === '0') {
            let currSelection = document.getSelection();
            let currStr = document.getSelection().anchorNode.data;
            let newStr = document.createElement('p');
            newStr.innerText = currStr;
            console.log(newStr);
            currSelection.anchorNode.parentNode.insertBefore(
              newStr,
              currSelection.anchorNode
            );
            currSelection.anchorNode.parentNode.removeChild(
              currSelection.anchorNode
            );
          }
        }}
      >
        <option>Select a heading</option>
        <option value="0">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
      </select>

      <button
        onClick={e => {
          if (
            document.getSelection().anchorNode.parentElement.localName === 'pre'
          ) {
            return;
          } else {
            format('bold');
          }
        }}
      >
        <FaBold />
      </button>
      <button
        onClick={e => {
          if (
            document.getSelection().anchorNode.parentElement.localName === 'pre'
          ) {
            return;
          } else {
            format('italic');
          }
        }}
      >
        <FaItalic />
      </button>
      <button
        onClick={e => {
          if (
            document.getSelection().anchorNode.parentElement.localName === 'pre'
          ) {
            return;
          } else {
            format('insertUnorderedList');
          }
        }}
      >
        <FaListUl />
      </button>
      <button
        onClick={e => {
          if (
            document.getSelection().anchorNode.parentElement.localName === 'pre'
          ) {
            return;
          } else {
            format('insertOrderedList');
          }
        }}
      >
        <FaListOl />
      </button>
      <button onClick={e => addLink()}>
        <FaLink />
      </button>
      <div id="url-input" className="hidden">
        <input id="txtFormatUrl" placeholder="https://www.example.com" />
        <button id="create-link-button" onClick={e => setUrl(e)}>
          Create Link
        </button>
      </div>

      <button onClick={e => addCodeBlock()}>
        <FaCode />
      </button>
    </div>
  );
}
