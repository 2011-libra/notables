import axios from 'axios';

//Action types
const RUN_CODE = 'RUN_CODE';

//Initial state

const codeState = {};

//Action creator

const runCode = stdout => ({
  type: RUN_CODE,
  stdout
});

//Thunk

export const fetchCode = (code, token) => {
  return async dispatch => {
    try {
      const sandboxResponse = await axios.post('/code', {
        code: code,
        token: token
      });
      dispatch(runCode(sandboxResponse.data));
    } catch (error) {
      console.log(error);
    }
  };
};

//Reducer
export default function codeEditorReducer(state = codeState, action) {
  switch (action.type) {
    case RUN_CODE:
      return { ...state, stdout: action.stdout };

    default:
      return state;
  }
}
