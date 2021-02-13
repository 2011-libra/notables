const axios = require('axios');

export default function autoSave(state) {
  setInterval(() => {
    let currDoc = document.getElementById('contentEditable').innerHTML;
    window.localStorage.setItem('savedDoc', currDoc);
  }, 1000);

  setInterval(() => {
    let stdoutNodeList = document.getElementsByClassName('sandbox-stdout');
    for (let i = stdoutNodeList.length - 1; i >= 0; i--) {
      stdoutNodeList[i].remove();
    }
  }, 60000);

  if(state.trim().length > 1){
    return;
  }

  if (window.localStorage.getItem('savedDoc')) {
    let savedDoc = window.localStorage.getItem('savedDoc');

    document.getElementById('contentEditable').innerHTML = savedDoc;

    if (
      document
        .getElementById('contentEditable')
        .innerHTML.includes('class="codeBlock"') ||
      document
        .getElementById('contentEditable')
        .innerHTML.includes("class='codeBlock'")
    ) {
      const allCodeBlockNode = document.getElementsByClassName('codeBlock');
      const allRunCodeButtons = document.getElementsByClassName(
        'run-code-button'
      );

      for (let i = 0; i < allCodeBlockNode.length; i++) {
        if(allCodeBlockNode[i] === undefined || allRunCodeButtons[i] === undefined){
          return;
        }
        allCodeBlockNode[i].id = 'codeBlock-' + i;
        allRunCodeButtons[i].id = 'codeBlock-' + i + '-button';
        allRunCodeButtons[i].disabled = false;
      }

      for (let i = 0; i < allRunCodeButtons.length; i++) {
        allRunCodeButtons[i].addEventListener('click', async () => {
          if (
            document.getElementById(`codeBlock-${i}`).innerText.trim() === '' ||
            document.getElementById(`codeBlock-${i}`).innerText.length < 2
          ) {
            alert(
              'Unable to "Run Code" if code block is empty, or less than 2 charaters long.'
            );
            return;
          }

          let runnableCode = document
            .getElementById(`codeBlock-${i}`)
            .innerText.replace('▶', '');

          if (document.getElementById(`stdout-for-${i}`)) {
            let outliers = document.getElementById(`stdout-for-${i}`).innerText;
            runnableCode = runnableCode
              .replace('▶', '')
              .slice(0, -outliers.length);
          }

          const today = new Date();

          document.getElementById(`codeBlock-${i}-button`).disabled = true;

          setTimeout(() => {
            // fail-safe
            document.getElementById(`codeBlock-${i}-button`).disabled = false;
          }, 8000);

          const stdout = await axios.post('/code', {
            code: runnableCode,
            token: `${Math.ceil(
              Math.random() * (8888 - 0) + 0
            )}${today.getFullYear()}${today.getMonth()}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getMilliseconds()}`
          });

          if (!document.getElementById(`stdout-for-${i}`)) {
            const outputNode = document.createElement('pre');
            outputNode.innerText = stdout.data;
            outputNode.id = `stdout-for-${i}`;
            outputNode.className = 'sandbox-stdout';
            outputNode.setAttribute('contentEditable', false);
            document.getElementById(`codeBlock-${i}`).appendChild(outputNode);
          } else {
            document.getElementById(`stdout-for-${i}`).innerText = stdout.data;
          }
          setTimeout(() => {
            document.getElementById(`codeBlock-${i}-button`).disabled = false;
          }, 2000);
        });
      }
    }
  }
}
