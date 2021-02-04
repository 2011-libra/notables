import React from 'react';
import './Texteditor.css';
import CodeBlock from './CodeBlock';
import Toolbar from './toolbar';
let TurndownService = window.TurndownService;

function texteditor() {
  const downloadTxtFile = () => {
    let innerHTML = document.getElementById('contentEditable').innerHTML;
    let turndownService = new TurndownService();
    let markdown = turndownService.turndown(innerHTML);
    console.log(markdown);

    const element = document.createElement('a');
    const file = new Blob([markdown], {
      type: 'text/richtext;charset=utf-8'
    });
    element.href = URL.createObjectURL(file);
    element.download = 'myFile.md';
    document.body.appendChild(element);
    element.click();
  };



  return (
    <div className="texteditor_container">
      <div className="codeeditor_button">
        <button onClick={downloadTxtFile}>Export</button>
      </div>
      <Toolbar />
      <div
        className="editor"
        id="contentEditable"
        contentEditable="true"
        data-placeholder="Type your notes here!"
      ></div>
      <div id="targetDiv"></div>
      <CodeBlock />
    </div>
  );
}

export default texteditor;
