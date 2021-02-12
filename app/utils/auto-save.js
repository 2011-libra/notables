const md = require('markdown-it')();
const TurndownService = require('turndown').default;
let turndownService = new TurndownService();
turndownService.addRule('code-snippet', {
  filter: ['pre'],
  replacement: content => {
    return '```' + content + '```';
  }
})
import createCodeRunnerEvent from '../utils/createCodeRunnerEvent';

export default function autoSave (){
  console.log('autoSave() triggered!')
  const convertToMD = () => {
    let stdoutNodeList = document.getElementsByClassName('sandbox-stdout');
    for (let i = stdoutNodeList.length - 1; i >= 0; i--) {
      stdoutNodeList[i].remove();
    }

    let innerHTML = document.getElementById('contentEditable').innerHTML;
    innerHTML = innerHTML.replace(/▶.Run.Code/g, '');

    createCodeRunnerEvent();
    let markdown = turndownService.turndown(innerHTML);

    return markdown
  };

  setInterval(()=>{
    //convert content to MD
    let currDocMD = convertToMD()
    //store in localstorage
    window.localStorage.setItem('savedDoc', currDocMD)

    console.log('Document has been auto saved.')
  }, 10000)

  if(window.localStorage.savedDoc){
    //get local storage
    let savedDoc = window.localStorage.getItem('sessionDoc');
    //convert from MD > HTML
    markdown = md
          .render(savedDoc)
          .replace(
            /<p><code>/g,
            `<pre class="codeBlock" id='codeBlock-TBD'>`
          )
          .replace(/<\/code><\/p>/g, `</pre><button id="TBD-button" class="run-code-button" contentEditable=false placeholder="add your code here...">▶ Run Code</button>`);
    //then use it to render
    document.getElementById('contentEditable').innerHTML = markdown;

    //create run code buttons
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
          if(
            document.getElementById(`codeBlock-${i}`).innerText.trim() === '' ||
            document.getElementById(`codeBlock-${i}`).innerText.length < 2
          ){
            alert('Unable to "Run Code" if code block is empty, or less than 2 charaters long.')
            return;
          }

          let runnableCode = document
            .getElementById(`codeBlock-${i}`)
            .innerText.replace('▶', '');

          if (document.getElementById(`stdout-for-${i}`)) {
            let outliers = document.getElementById(`stdout-for-${i}`).innerText;
            runnableCode = runnableCode.replace('▶', '').slice(0, -outliers.length);
          }

          const today = new Date();

          document.getElementById(`codeBlock-${i}-button`).disabled = true;

          setTimeout(() => {
            // fail-safe
            document.getElementById(`codeBlock-${i}-button`).disabled = false;
          }, 8000)

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
          }, 2000)
        });
      }
    }
  }
}
