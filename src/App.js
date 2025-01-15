// Uygulama genelinde yönlendirme ve oturum kontrolünü yapıyoruz.
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
import MyVocabularys from './UserMenu/MyVocabularys.js';

import LearnEnglish from './Learning/English/LearnEnglish';
import ListEnglish from './Learning/English/ListEnglish';
import WillLearnEnglish from './Learning/English/WillLearnEnglish';
import QuizEnglish from './Learning/English/QuizEnglish';

import LearnGerman from './Learning/German/LearnGerman';
import ListGerman from './Learning/German/ListGerman.js';
import WillLearnGerman from './Learning/German/WillLearnGerman';
import QuizGerman from './Learning/German/QuizGerman';

import LearnFrench from './Learning/French/LearnFrench';
import ListFrench from './Learning/French/ListFrench';
import WillLearnFrench from './Learning/French/WillLearnFrench';
import QuizFrench from './Learning/French/QuizFrench';

import LearnSpanish from './Learning/Spanish/LearnSpanish';
import ListSpanish from './Learning/Spanish/ListSpanish';
import WillLearnSpanish from './Learning/Spanish/WillLearnSpanish';
import QuizSpanish from './Learning/Spanish/QuizSpanish';

import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function App() {
  // Kullanıcının giriş yapıp yapmadığını ve admin durumunu takip ettiğimiz state değişkenleri
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  // Kullanıcı çıkış yaptığında değişkenleri sıfırlıyoruz.
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  // Uygulama genelini Router sarmalına alıyoruz.
  return (
    <Router>
      <div className="App">
        {/* Navbar'ımız */}
        <Navbar className="navbar" expand="lg">
          <Container>
            {/* Uygulama adı, kullanıcı giriş yapmışsa anasayfaya, yapmamışsa login'e yönlendiriyor */}
            <Navbar.Brand className="navbar_v" as={Link} to={isLoggedIn ? (isAdmin ? "/" : "/") : "/login"}>
              Vocabulary Wave
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {/* Kullanıcı giriş yapmışsa sadece "Çıkış Yap" butonunu, yoksa "Giriş Yap" ve "Kayıt Ol" linklerini gösteriyoruz */}
                {isLoggedIn ? (
                  <>
                    <Button variant="outline-light" onClick={handleLogout}>
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Giriş Yap</Nav.Link>
                    <Nav.Link as={Link} to="/register">Kayıt Ol</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Uygulama rotalarını burada tanımlıyoruz */}
        <Container className="mt-4">
          <Routes>
            {/* Giriş sayfası: kullanıcı zaten giriş yaptıysa ana sayfaya yönlendir */}
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
            {/* Kayıt sayfası: kullanıcı zaten giriş yaptıysa ana sayfaya yönlendir */}
            <Route
              path="/register"
              element={
                isLoggedIn ? <Navigate to="/" /> : <Register />
              }
            />
            {/* Ana sayfa: Eğer kullanıcı admin ise AdminMenu, değilse MainMenu gösteriyoruz */}
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
            {/* Kullanıcının hesap menüsü */}
            <Route
              path="/myaccount"
              element={
                isLoggedIn ? <MyAccount /> : <Navigate to="/login" />
              }
            />
            {/* Dil seçimi menüsü */}
            <Route
              path="/language"
              element={
                isLoggedIn ? <Language /> : <Navigate to="/login" />
              }
            />
            {/* Diller için gidiş */}
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
            {/* Admin kelime ekleme, güncelleme ve silme rotaları */}
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
            {/* Kullanıcı bilgileri güncelleme sayfası */}
            <Route
              path="/myaccount/info"
              element={
                isLoggedIn ? <MyInfo user={user} /> : <Navigate to="/login" />
              }
            />
            {/* İngilizce öğrenme, listeleme, quiz */}
            <Route
              path="/learn-english"
              element={
                isLoggedIn ? <LearnEnglish /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/list-english"
              element={
                isLoggedIn ? <ListEnglish /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/will-learn-english"
              element={
                isLoggedIn ? <WillLearnEnglish /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/quiz-english"
              element={
                isLoggedIn ? <QuizEnglish /> : <Navigate to="/login" />
              }
            />
            {/* Almanca öğrenme, listeleme, quiz */}
            <Route
              path="/learn-german"
              element={
                isLoggedIn ? <LearnGerman /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/list-german"
              element={
                isLoggedIn ? <ListGerman /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/will-learn-german"
              element={
                isLoggedIn ? <WillLearnGerman /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/quiz-german"
              element={
                isLoggedIn ? <QuizGerman /> : <Navigate to="/login" />
              }
            />
            {/* Fransızca öğrenme, listeleme, quiz */}
            <Route
              path="/learn-french"
              element={
                isLoggedIn ? <LearnFrench /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/list-french"
              element={
                isLoggedIn ? <ListFrench /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/will-learn-french"
              element={
                isLoggedIn ? <WillLearnFrench /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/quiz-french"
              element={
                isLoggedIn ? <QuizFrench /> : <Navigate to="/login" />
              }
            />
            {/* İspanyolca öğrenme, listeleme, quiz */}
            <Route
              path="/learn-spanish"
              element={
                isLoggedIn ? <LearnSpanish /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/list-spanish"
              element={
                isLoggedIn ? <ListSpanish /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/will-learn-spanish"
              element={
                isLoggedIn ? <WillLearnSpanish /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/quiz-spanish"
              element={
                isLoggedIn ? <QuizSpanish /> : <Navigate to="/login" />
              }
            />
            {/* Kullanıcının kelime haznesini görüntülediği sayfa */}
            <Route
              path="/my-vocabularys"
              element={
                isLoggedIn ? <MyVocabularys /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

// Bileşeni dışa aktarıyoruz ki, index.js içinde çağırabilelim.
export default App;
