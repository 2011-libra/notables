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
