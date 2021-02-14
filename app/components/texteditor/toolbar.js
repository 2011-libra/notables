import React, { useEffect } from 'react';
import format from '../../utils/format';
import { setUrl, addLink } from '../../utils/hyperlink';
import addCodeBlock from '../../utils/addCodeBlock';
import clearDoc from '../../utils/clearDoc';
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaLink,
  FaCode,
} from 'react-icons/fa';
import {
  BsTrash
} from 'react-icons/bs';
import './Texteditor.css';

export default function toolbar() {
  useEffect(() => {
    if (document.getElementById('txtFormatUrl')) {
      document.getElementById('txtFormatUrl').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          setUrl(e);
        }
      });
    }
  });

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
          <option>Select a heading</option>
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
        <button title="Delete Document" id="trash-doc" onClick={e => clearDoc()}>
          <BsTrash />
      </button>
      </div>
      <div id="url-input" className="toolbar link-bar beneath">
        <div className="link-drawer">
          {document.getSelection().anchorNode &&
          document.getSelection().anchorNode.className &&
          document.getSelection().anchorNode.className.toLowerCase() === 'a' &&
          document.getSelection().anchorNode ===
            document.getSelection().focusNode ? (
            <button id="remove-link-button" onClick={e => removeUrl(e)}>
              Remove Link
            </button>
          ) : (
            <>
              <input id="txtFormatUrl" placeholder="https://www.example.com" />
              <button id="create-link-button" onClick={e => setUrl(e)}>
                Create Link
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
