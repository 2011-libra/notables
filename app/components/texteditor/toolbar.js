import React from 'react';
import { FaBold, FaItalic } from 'react-icons/fa';
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
  //SETTING HEADERS
  function setHeaderOne() {
    const target = document.getSelection();
    format('insertHTML', `<h1>${target}</h1>`);
  }
  function setHeaderTwo() {
    const target = document.getSelection();
    format('insertHTML', `<h2>${target}</h2>`);
  }

  //CODEBLOCK? Very buggy
  function addCodeBlock() {
    const codeBlock = document.createElement('pre');
    const target = document.getSelection();
    if (
      target.focusNode.nodeName.includes('#text') ||
      target.focusNode.classList.contains('title') ||
      target.focusNode.className.includes('codeBlock')
    ) {
      return;
    }
    const id = `codeBlock-${
      document.getElementsByClassName('codeBlock').length + 1
    }`;
    codeBlock.classList.add('codeBlock');

    format('insertHTML', `<pre class='codeBlock' id='${id}'>${target}</pre>`);
    addLineAfterBlock(id);
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
      <button onClick={e => format('bold')}>
        <FaBold />
      </button>
      <button onClick={e => format('italic')}>
        <FaItalic />
      </button>
      <button onClick={e => format('insertUnorderedList')}>List</button>
      <button onClick={e => addLink()}>Link</button>
      <div id="url-input" className="hidden">
        <input id="txtFormatUrl" placeholder="url" />
        <button onClick={e => setUrl(e)}>Create Link</button>
      </div>
      <button onClick={e => setHeaderOne()}>Header 1</button>
      <button onClick={e => setHeaderTwo()}>Header 2</button>
      <button onClick={e => addCodeBlock()}>CodeBlock</button>
    </div>
  );
}
