import React from 'react';
import './Texteditor.css';
import Toolbar from './toolbar';

function texteditor() {
  return (
    <div className="texteditor_container">
      <div
        id="title"
        contentEditable="true"
        data-placeholder="Your title here..."
        className="title"
      ></div>
      <Toolbar />
      <div
        className="editor"
        id="editor"
        contentEditable="true"
        data-placeholder="Type your notes here!"
      ></div>
    </div>
  );
}

export default texteditor;
