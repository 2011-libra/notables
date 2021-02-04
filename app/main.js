import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import '../public/index.css';
import './socket';
import Navbar from './components/navbar/navbar';
import NavItem from './components/navbar/navitem';
import { FaCog } from 'react-icons/fa';
import DropdownMenu from './components/navbar/dropdownmenu';
import Texteditor from './components/texteditor/texteditor.js';
import { CgProfile } from 'react-icons/cg';
import { MdImportExport } from 'react-icons/md';
import Nav from './components/navbar/nav';
import { GiHamburgerMenu } from 'react-icons/gi';

ReactDOM.render(
  <Provider store={store}>
    {/* <Navbar>
      <NavItem icon={<GiHamburgerMenu />}>
        <DropdownMenu></DropdownMenu>
      </NavItem>
    </Navbar> */}
    <Nav />
    <Texteditor />
  </Provider>,
  document.getElementById('app')
);

// make sure this is the same as the id of the div in your index.html
