import React from 'react';
import './Texteditor.css';
import Codeeditor from './codeeditor';
import Toolbar from './toolbar';

function texteditor() {
  const downloadTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [document.getElementById('contentEditable').innerText],
      {
        type: 'text/richtext;charset=utf-8'
      }
    );
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
      <Codeeditor />
    </div>
  );
}

export default texteditor;
