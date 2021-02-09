import { combineReducers } from 'redux';
import codeEditorReducer from './CodeEditor';
import importReducer from './import';

const appReducer = combineReducers({
  stdout: codeEditorReducer,
  import: importReducer
});

export default appReducer;
