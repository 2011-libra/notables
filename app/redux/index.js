import { combineReducers } from 'redux';
import codeEditorReducer from './CodeEditor';
import importReducer from './import';
import userReducer from './user';
const appReducer = combineReducers({
  stdout: codeEditorReducer,
  import: importReducer,
  user: userReducer
});

export default appReducer;
