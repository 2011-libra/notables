import React, { useState, useEffect } from 'react';

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
import { set } from 'lodash';

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

  function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  }

  /*****************/
  /*** HYPERLINK ***/
  /*****************/
  function addLink() {
    if (
      //***DRY CODE, FIGURE WAY TO REFACTOR LATER***//
      document.getSelection().anchorNode === null ||
      document.getSelection().anchorNode.innerText === '' ||
      document.getSelection().anchorNode.className === 'toolbar' ||
      document.getSelection().anchorNode.nodeValue === 'About us' ||
      document.getSelection().anchorNode.nodeValue === 'Upload' ||
      document.getSelection().anchorNode.nodeValue === 'Download' ||
      document.getSelection().anchorNode.nodeValue === null
      //***DRY CODE, FIGURE WAY TO REFACTOR LATER***//
    ) {
      alert(
        'Please select/highlight the text you are intending to hyperlink first.'
      );
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

    document.getElementById('url-input').classList.add('hidden');
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
    <>
      <div className="toolbar">
        <select
          onChange={e => {
            if (
              document.getSelection().anchorNode.parentElement.localName ===
              'pre'
            ) {
              return;
            }
            if (e.target.value === '1') {
              const target = document.getSelection();
              format('insertHTML', `<h1>${target}</h1>`);
              document.querySelector('select').selectedIndex = 0;
            } else if (e.target.value === '2') {
              const target = document.getSelection();
              format('insertHTML', `<h2>${target}</h2>`);
              document.querySelector('select').selectedIndex = 0;
            }
            //This code is manually changing the current tags and replacing it with p tags
            if (e.target.value === '0') {
              if (document.getSelection().anchorNode.data === undefined) {
                document.querySelector('select').selectedIndex = 0;
                return;
              }

              let currSelection = document.getSelection();
              let currStr = document.getSelection().anchorNode.data;
              let newStr = document.createElement('p');
              newStr.innerText = currStr;
              console.log(newStr);
              currSelection.anchorNode.parentNode.parentNode.insertBefore(
                newStr,
                currSelection.anchorNode.parentNode
              );
              currSelection.anchorNode.parentNode.parentNode.removeChild(
                currSelection.anchorNode.parentNode
              );
              document.querySelector('select').selectedIndex = 0;
            }
          }}
        >
          {/* <option>Select a heading</option> */}
          <option value="0">Normal text</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
        </select>

        <button
          title="Bold"
          onClick={e => {
            if (
              document.getSelection().anchorNode.parentElement.localName ===
              'pre'
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
          title="Italics"
          onClick={e => {
            if (
              document.getSelection().anchorNode.parentElement.localName ===
              'pre'
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
          title="Bulleted list"
          onClick={e => {
            if (
              document.getSelection().anchorNode.parentElement.localName ===
              'pre'
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
          title="Numbered list"
          onClick={e => {
            if (
              document.getSelection().anchorNode.parentElement.localName ===
              'pre'
            ) {
              return;
            } else {
              format('insertOrderedList');
            }
          }}
        >
          <FaListOl />
        </button>
        <button title="Add link" onClick={e => addLink()}>
          <FaLink />
        </button>

        <button title="Add code block" onClick={e => addCodeBlock()}>
          <FaCode />
        </button>
      </div>
      <div id="url-input" className="toolbar link-bar hidden">
        <div className="link-drawer">
          <input id="txtFormatUrl" placeholder="https://www.example.com" />
          <button id="create-link-button" onClick={e => setUrl(e)}>
            Create Link
          </button>
        </div>
      </div>
    </>
  );
}
