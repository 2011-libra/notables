import React from 'react';

export default function codeeditor() {
  return (
    <div>
      <div className="codeeditor_container">
        <div
          className="editor"
          id="editor"
          contentEditable="true"
          data-placeholder="Code here!"
        ></div>
        <div className="codeeditor_button">
          <button>Run code</button>
        </div>
      </div>
    </div>
  );
}
