import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import '../public/index.css';
import './socket';
import Texteditor from './components/texteditor/texteditor.js';

ReactDOM.render(
  <Provider store={store}>
    <Texteditor />
  </Provider>,
  document.getElementById('app')
);

// make sure this is the same as the id of the div in your index.html
