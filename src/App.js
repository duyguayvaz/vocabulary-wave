import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import MainMenu from './UserMenu/MainMenu';
import AdminMenu from './AdminMenu/AdminMenu';
import Language from './UserMenu/Language';
import MyAccount from './UserMenu/MyAccount';
import English from './Languages/English';
import German from './Languages/German';
import French from './Languages/French';
import Spanish from './Languages/Spanish';
import AddWord from './AdminMenu/AddWord'; 
import UpdateWord from './AdminMenu/UpdateWord'; 
import DeleteWord from './AdminMenu/DeleteWord';
import MyInfo from './UserMenu/MyInfo';
import LearnEnglish from './Learning/English/LearnEnglish'; // Yeni sayfa import
import ListEnglish from'./Learning/English/ListEnglish';
import WillLearnEnglish from './Learning/English/WillLearnEnglish'
import QuizEnglish from './Learning/English/QuizEnglish'
import LearnGerman from './Learning/German/LearnGerman'
import ListGerman from './Learning/German/ListGerman';


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
        <Navbar 
            className = "navbar" 
            expand="lg">
          <Container>           
            <Navbar.Brand as={Link} to={isLoggedIn ? (isAdmin ? "/" : "/") : "/login"}>
              Vocabulary Wave
            </Navbar.Brand>
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
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
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
           
            <Route
              path="/add-word"
              element={
                isLoggedIn && isAdmin ? <AddWord /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/update-word"
              element={
                isLoggedIn && isAdmin ? <UpdateWord /> : <Navigate to="/login" />
              }
            />
            
            <Route
              path="/delete-word"
              element={
                isLoggedIn && isAdmin ? <DeleteWord /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/myaccount/info"
              element={
                isLoggedIn ? <MyInfo user={user} /> : <Navigate to="/login" />
              }
            />

            <Route>
              <Route
                path="/learn-english"
                element={
                  isLoggedIn ? <LearnEnglish /> : <Navigate to="/login" />
                }
              />
            </Route>

            <Route>
              <Route
                path="/list-english"
                element={
                  isLoggedIn ? <ListEnglish /> : <Navigate to="/login" />
                }
              />
            </Route>

            <Route>
              <Route
                path="/will-learn-english"
                element={
                  isLoggedIn ? <WillLearnEnglish /> : <Navigate to="/login" />
                }
              />
            </Route>

            <Route>
              <Route
                path="/quiz-english"
                element={
                  isLoggedIn ? <QuizEnglish /> : <Navigate to="/login" />
                }
              />
            </Route>

            <Route>
              <Route
                path="/learn-german"
                element={
                  isLoggedIn ? <LearnGerman /> : <Navigate to="/login" />
                }
              />
            </Route>

            <Route
              path="/list-german"
              element={
                isLoggedIn ? <ListGerman /> : <Navigate to="/login" />
              }
            />

          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
