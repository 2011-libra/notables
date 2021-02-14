let hyperlinkSelection = null;
let anchorNode = null;
let anchorOffset = 0;
let focusNode = null;
let focusOffset = 0;

export function addLink() {
  const hypNode = document.getElementById('url-input');
  if (!hypNode.classList.contains('beneath')) {
    hypNode.classList.add('beneath');
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
    document.getSelection().anchorNode.nodeValue === null ||
    document.getSelection().anchorNode.length < 2
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

  hypNode.classList.remove('beneath');
}

export function setUrl(e) {
  e.preventDefault();
  if (document.getSelection().anchorNode.parentElement.localName === 'pre') {
    return;
  }

  document.getElementById('url-input').classList.add('beneath');
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

  document.execCommand('createLink', false, 'PLACEHOLDER_URL');
  let newHyperlinks = document.querySelectorAll('a[href="PLACEHOLDER_URL"]');
  for (let newHyperlink of newHyperlinks) {
    newHyperlink.href =
      url.slice(0, 4).toLowerCase() === 'http' ? url : `https://${url}`;
    newHyperlink.target = '_blank';
    newHyperlink.contentEditable = false;
  }
}
