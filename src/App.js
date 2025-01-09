import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./Authentication/Register";
import Login from "./Authentication/Login";


const Home = () => {
  return (
    <div className="home-container">
      <div className="card-container">
        <Link to="/login" className="home-card">
          Giriş Yap
        </Link>
        <Link to="/register" className="home-card">
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
