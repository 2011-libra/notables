import axios from 'axios';

//Action types
const GET_IMPORT = 'GET_IMPORT';

//Initial state

const importState = {};

//Action creator

export const getImport = result => ({
  type: GET_IMPORT,
  result
});

//Thunk

//Reducer
export default function importReducer(state = importState, action) {
  switch (action.type) {
    case GET_IMPORT:
      return { ...state, result: action.result };

    default:
      return state;
  }
}
