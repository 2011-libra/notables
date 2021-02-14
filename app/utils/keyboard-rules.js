export default function keyboardRules(){
  onkeypress = (e) => {
    if(document.getSelection().anchorNode.parentElement.localName === 'pre' ||
    document.getSelection().anchorNode.localName === 'pre'
    ){
      if(e.key === 'Enter' && e.shiftKey === true){
        return;
      }
      if(e.key === 'Enter' || e.code === 'Enter'){
        e.preventDefault()
        alert('Use `shift + enter` to start on a new line.')
        return;
      }
    }
  }

  onkeydown = (e) => {
    if(document.getSelection().anchorNode.parentElement.localName === 'pre' ||
    document.getSelection().anchorNode.localName === 'pre'
    ){
      if(e.key === 'ArrowDown' && !document.getSelection().anchorNode.nextSibling){
          const target = document.getElementById('contentEditable')
          const br = document.createElement('br');
          target.appendChild(br);
      }
      if(e.key === 'ArrowUp' && !document.getSelection().anchorNode.previousSibling){
        const currSelect = document.getSelection().anchorNode
        const br = document.createElement('br');
        currSelect.parentNode.prepend(br);
      }
      return;
    }

    try {
      if(document.getSelection().anchorNode.previousSibling.innerText.includes('Run Code') ||
      document.getSelection().anchorNode.previousSibling.id.includes('codeBlock')
      ){
        if(e.key === 'Backspace'){
          let targetId = document.getSelection().anchorNode.previousSibling.previousSibling.id;
          document.getElementById(targetId).remove()
        }
        return;
      }
    } catch (error) {
      return;
    }
  }

}
