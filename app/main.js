import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import '../public/index.css';
import './socket';
import Texteditor from './components/texteditor/texteditor.js';
import Nav from './components/navbar/nav';
import Routes from './routes';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Nav />
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('app')
);

// make sure this is the same as the id of the div in your index.html
