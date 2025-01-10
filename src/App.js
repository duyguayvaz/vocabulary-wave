// App.js
import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import "./App.css";  // CSS dosyan

function App() {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  const handleLogin = () => setLogin(true);
  const handleLoginBack = () => setLogin(false);
  const handleRegister = () => setRegister(true);
  const RegisterBack = () => setRegister(false);

  // Kayıt sayfasına geçtiyse
  if (register) {
    return <Register onBackToMenu={RegisterBack} />;
  }

  // Login sayfasına geçtiyse
  if (login) {
    return <Login onBackToMenu={handleLoginBack} />;
  }

  // Ana sayfa (iki kart görünecek)
  return (
    <div className="app-container">
      {/* Üstteki Kart */}
      <Card className="top-card">
        <Card.Body>
          <Card.Title className="card-title">Vocabulary Wave</Card.Title>
        </Card.Body>
      </Card>

      {/* Ortadaki Kart (Login / Register Butonları) */}
      <Card className="main-card">
        <Card.Body>
          <Button className="mb-3" onClick={handleLogin}>
            Login
          </Button>
          <Button onClick={handleRegister}>Register</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default App;
