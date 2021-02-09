import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './components/login/login';
import TextEditor from './components/texteditor/texteditor';

export default function Routes() {
  return (
    <Switch>
      {/* Routes placed here are available to all visitors */}
      <Route exact path="/" component={TextEditor} />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}
