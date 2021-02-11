function createCodeRunnerEvent() {
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
      allCodeBlockNode[i].id = 'codeBlock-' + i;
      allRunCodeButtons[i].id = 'codeBlock-' + i + '-button';
    }

    for (let i = 0; i < allRunCodeButtons.length; i++) {
      allRunCodeButtons[i].addEventListener('click', async () => {
        let runnableCode = document
          .getElementById(`codeBlock-${i}`)
          .innerText.replace('▶', '');

        if (document.getElementById(`stdout-for-${i}`)) {
          let outliers = document.getElementById(`stdout-for-${i}`).innerText;
          runnableCode = runnableCode.replace('▶', '').slice(0, -outliers.length);
        }


        const today = new Date();

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
      });
    }
  }
}

export default createCodeRunnerEvent;
