import React, { useEffect, useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { fetchCode } from '../../redux/CodeEditor';

export default function CodeBlock (props) {
  let codeState = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect (()=>{
    document.getElementById('code-snippet').innerText = codeState.stdout.stdout || ''
    },
    [codeState]
  )

  async function handleSubmit(evt) {
    evt.preventDefault();
    const today = new Date();
    const codeSnippet = document.getElementById('code-snippet').innerText;
    await dispatch(fetchCode(codeSnippet, `${Math.ceil(
      Math.random() * (8888 - 0) + 0
    )}${today.getFullYear()}${today.getMonth()}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getMilliseconds()}`));
  }

  return (
    <div>
      <form
        className="code-block-container"
        onSubmit={evt => {
          handleSubmit(evt);
        }}
      >
        <div
          className="code-blocks"
          id="code-snippet"
          contentEditable="true"
          data-placeholder="Code here!"
        ></div>
        <div className="code-block-buttons">
          <button type="submit">Run code</button>
        </div>
      </form>
    </div>
  );
}

// export default class codeeditor extends React.Component{

// async handleSubmit(evt){
//   evt.preventDefault()
//   console.log(evt)

//   const targetNode = document.getElementById('editor')
//     console.log(targetNode.innerText)

//     const sandboxResponse = await axios.post('/code', {code: targetNode.innerText, token: '888888888'})
//     console.log(sandboxResponse)
//     targetNode.innerText = sandboxResponse.data;
// }

//   render(){
//     return (
//     <div>
//       <form className="codeeditor_container" onSubmit={(evt)=>{this.handleSubmit(evt)}}>
//         <div
//           className="editor"
//           id="editor"
//           contentEditable="true"
//           data-placeholder="Code here!"
//         ></div>
//         <div className="codeeditor_button">
//           <button type="submit">Run code</button>
//         </div>
//       </form>
//     </div>
//   );
//   }
// }
