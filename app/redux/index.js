import { combineReducers } from 'redux';
import codeEditorReducer from './CodeEditor';

const appReducer = combineReducers({
  stdout: codeEditorReducer
});

export default appReducer;
