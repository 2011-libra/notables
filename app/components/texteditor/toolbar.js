import React, { useState } from 'react';
import axios from 'axios'
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

    // format and inserts html element
    format('insertHTML', `<pre class='codeBlock' id='${id}' tabindex=0><button id="${id}-button"contentEditable=false >▶</button>${target} </pre>`);

    // add a line break after the code block
    addLineAfterBlock(id);

    // event listener for running the code
    document.getElementById(`${id}-button`).addEventListener('click', async ()=>{
      let runnableCode = document.getElementById(`${id}`).innerText.slice(1)
      console.log('before cleanse::', runnableCode)
      // await dispatch(fetchCode(runnableCode, 'sample-token'));

      // preprocessing string to remove outliers
      if(document.getElementById(`stdout-for-${id}`)){
        let outliers= document.getElementById(`stdout-for-${id}`).innerText
        runnableCode = runnableCode.slice(1, -outliers.length)
      }

      // sending code to docker container
      const stdout = await axios.post('/code', {
        code: runnableCode,
        token: 'sample-token'
        })

      if(!document.getElementById(`stdout-for-${id}`)){
        const outputNode = document.createElement('pre')
        outputNode.innerText = stdout.data
        outputNode.id = `stdout-for-${id}`
        outputNode.className = 'sandbox-stdout'
        document.getElementById(`${id}`).appendChild(outputNode)
      } else {
        document.getElementById(`stdout-for-${id}`).innerText = stdout.data
      }
    })
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

