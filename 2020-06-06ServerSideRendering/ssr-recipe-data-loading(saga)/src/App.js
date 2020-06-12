import BluePage from './pages/BluePage';
import Menu from './components/Menu';
import React from 'react';
import RedPage from './pages/RedPage';
import { Route } from 'react-router-dom';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
      <Route path="/users" component={UsersPage} />
    </div>
  );
}

export default App;