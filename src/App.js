// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import MainMenu from './Menu/MainMenu';
import AdminMenu from './Menu/AdminMenu';
import Language from './Menu/Language';
import MyAccount from './Menu/MyAccount';
import English from './Languages/English';
import German from './Languages/German';
import French from './Languages/French';
import Spanish from './Languages/Spanish';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Vocabulary Wave</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {isLoggedIn ? (
                  <>
                    <Navbar.Text className="me-3">
                      Signed in as: {user}
                    </Navbar.Text>
                    <Button variant="outline-light" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/register">Register</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route 
              path="/login" 
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setUser={setUser}
                    setIsAdmin={setIsAdmin}
                  />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isLoggedIn ? <Navigate to="/" /> : <Register />
              } 
            />
            <Route 
              path="/" 
              element={
                isLoggedIn ? (
                  isAdmin ? <AdminMenu /> : <MainMenu />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />      

            <Route
             path="/myaccount"
            element={
            isLoggedIn ? <MyAccount /> : <Navigate to="/login" />
              }
            />

            <Route 
              path="/language"
              element={
                isLoggedIn ? <Language /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/language/english"
              element={
                isLoggedIn ? <English /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/language/german"
              element={
                isLoggedIn ? <German /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/language/french"
              element={
                isLoggedIn ? <French /> : <Navigate to="/login" />
              }
            />
         
            <Route
              path="/language/spanish"
              element={
                isLoggedIn ? <Spanish /> : <Navigate to="/login" />
              }
            />


          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
