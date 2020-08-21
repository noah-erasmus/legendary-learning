import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { SignIn } from './components/SignIn';
import { Timetable } from './components/Timetable';
import 'fontsource-roboto';
import { Details } from './components/Details'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/classes">Classes</Link>
              </li>
            </ul>
          </nav>
          <Switch>

            <Route path='/classes'>
              <Timetable />
            </Route>
            <Route path='/classDetails/:classId'>
              <Details />
            </Route>
            <Route exact path="/">
              <SignIn></SignIn>
            </Route>


          </Switch>
        </div>

      </Router>
    </div>
  );
}

export default App;
