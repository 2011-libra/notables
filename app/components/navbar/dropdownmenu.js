import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';
import {
  FaCog,
  FaArrowAltCircleRight,
  FaBolt,
  FaArrowAltCircleLeft
} from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { MdImportExport } from 'react-icons/md';

import { CSSTransition } from 'react-transition-group';

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a
        href="#"
        className="menu-item"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }
  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem
            leftIcon={<FaCog />}
            rightIcon={<FaArrowAltCircleRight />}
            goToMenu="settings"
          >
            Settings
          </DropdownItem>
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<FaArrowAltCircleLeft />}>
            <h2>Settings</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<FaBolt />}>Dark Mode</DropdownItem>
          <DropdownItem leftIcon={<FaBolt />}>Word Count</DropdownItem>
        </div>
      </CSSTransition>
      {/* account */}
      {/* <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem
            leftIcon={<CgProfile />}
            rightIcon={<FaArrowAltCircleRight />}
            goToMenu="account"
          >
            Account
          </DropdownItem>
        </div>
      </CSSTransition> */}
      {/* <CSSTransition
        in={activeMenu === 'account'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="account" leftIcon={<FaArrowAltCircleLeft />}>
            <h2>account</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<FaBolt />}>Sign In</DropdownItem>
          <DropdownItem leftIcon={<FaBolt />}>Sign Out</DropdownItem>
        </div>
      </CSSTransition> */}
    </div>
  );
}

export default DropdownMenu;
