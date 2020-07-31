import React from 'react';
import './App.css';
import Notes from './Notes';
import Note from './Note';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Notes}></Route>
          <Route path="/note/:id/:title?" component={Note} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
