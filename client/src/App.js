import Home from '../src/pages/homepage/Home';
import Profile from './pages/profilepage/Profile';
import Login from './pages/login/Login';
import Demo from './components/Demo';
import Register from './pages/register/Register';
import {BrowserRouter as Router,Switch,Route, Redirect} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Messenger from './pages/messenger/Messenger';
function App() {
  const {user}=useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {user ? <Home/> : <Register/>}
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/"/> : <Login/>}
        </Route>
        <Route path="/register">
        {user ? <Redirect to="/"/> : <Register/>}
        </Route>
        <Route path="/profile/:username">
          <Profile/>
        </Route>
        <Route path="/messenger">
          <Messenger/>
        </Route>
        <Route path="/demo" exact>
          <Demo/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
