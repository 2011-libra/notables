import React, { useState, useEffect } from 'react';
import format from '../../utils/format';
import {setUrl, addLink} from '../../utils/hyperlink'
import addCodeBlock from '../../utils/addCodeBlock';
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

  let hyperlinkSelection = null;
  let anchorNode = null;
  let anchorOffset = 0;
  let focusNode = null;
  let focusOffset = 0;


  useEffect(() => {
    if (document.getElementById('txtFormatUrl')) {
      document.getElementById('txtFormatUrl').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          setUrl(e);
        }
      });
    }
  });


  function addLink() {
    const hypNode = document.getElementById('url-input');
    if (!hypNode.classList.contains('hidden')) {
      hypNode.classList.add('hidden');
      return;
    }
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

    hyperlinkSelection = document.getSelection();
    anchorNode = hyperlinkSelection.anchorNode;
    anchorOffset = hyperlinkSelection.anchorOffset;
    focusNode = hyperlinkSelection.focusNode;
    focusOffset = hyperlinkSelection.focusOffset;

    if (document.getSelection().anchorNode.parentElement.localName === 'pre') {
      alert('You can not add a hyperlink inside a code block');
      return;
    }

    hypNode.classList.remove('hidden');
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

    hyperlinkSelection.setBaseAndExtent(
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset
    );
    // let currSelection = hyperlinkSelection;
    // let currStr = currSelection.data;
    // let newHyperlink = document.createElement('a');
    // newHyperlink.innerText = currStr;
    // newHyperlink.href = `https://${url}`;
    // newHyperlink.target = '_blank';
    // newHyperlink.contentEditable = false;

    // currSelection.parentNode.insertBefore(newHyperlink, currSelection);
    // currSelection.parentNode.removeChild(currSelection);

    format('createLink', 'PLACEHOLDER_URL');
    let newHyperlinks = document.querySelectorAll('a[href="PLACEHOLDER_URL"]');
    for (let newHyperlink of newHyperlinks) {
      newHyperlink.href =
        url.slice(0, 4).toLowerCase() === 'http' ? url : `https://${url}`;
      newHyperlink.target = '_blank';
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
              // const target = document.getSelection();
              // format('insertHTML', `<h1>${target}</h1>`);
              format('heading', 'H1');
              document.querySelector('select').selectedIndex = 0;
            } else if (e.target.value === '2') {
              // const target = document.getSelection();
              // format('insertHTML', `<h2>${target}</h2>`);
              format('heading', 'H2');
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
