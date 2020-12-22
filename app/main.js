import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import '../public/index.css';

ReactDOM.render(
  <Provider store={store}>
    {/* Add your React component(s) here */}
  </Provider>,
  document.getElementById('app')
);

// make sure this is the same as the id of the div in your index.html
