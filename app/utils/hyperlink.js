let hyperlinkSelection = '';

export function addLink() {
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

export function setUrl(e) {
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
