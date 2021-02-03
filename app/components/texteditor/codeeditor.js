import React, { useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { fetchCode } from '../../redux/CodeEditor';
import axios from 'axios'; //temporary axios for development, will move to thunk

export default function codeeditor() {
  const codeState = useSelector(state => state);
  console.log('im the stateeeee', codeState);

  const dispatch = useDispatch();

  async function handleSubmit(evt) {
    evt.preventDefault();
    console.log(evt);
    // runcode();
    const codeSnippet = document.getElementById('editor').innerText;
    console.log(codeSnippet);
    await dispatch(fetchCode(codeSnippet, '12345'));
    //codeState =
    console.log('codeStateeeee', codeState);
  }

  return (
    <div>
      <form
        className="codeeditor_container"
        onSubmit={evt => {
          handleSubmit(evt);
        }}
      >
        <div
          className="editor"
          id="editor"
          contentEditable="true"
          data-placeholder="Code here!"
        ></div>
        <div className="codeeditor_button">
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
