import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Login } from '../pages/login';
import { Signup } from '../pages/signup';

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};
