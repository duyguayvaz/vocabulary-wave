// src/App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

import Languages from './pages/dashboard/Languages'
import MyAccount from './pages/dashboard/MyAccount'
import MyInfo from './pages/dashboard/MyInfo'
import MyVocab from './pages/dashboard/MyVocab'

// PrivateRoute ile korumalı alan örneği
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/giris-yap'
    return null
  }
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana sayfa */}
        <Route path="/" element={<Home />} />

        {/* Kayıt ve Giriş */}
        <Route path="/kayit-ol" element={<Register />} />
        <Route path="/giris-yap" element={<Login />} />

        {/* Dashboard (Korumalı) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Nested Routes */}
          <Route path="languages" element={<Languages />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="my-info" element={<MyInfo />} />
          <Route path="my-vocab" element={<MyVocab />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
