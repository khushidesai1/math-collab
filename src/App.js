import React from 'react';
import './App.css';
import Login from './Login';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Login}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
