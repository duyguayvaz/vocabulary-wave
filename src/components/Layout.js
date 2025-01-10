// src/components/Layout.js
import React from 'react'
import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <>
      {/* Üst menü */}
      <Navbar bg="dark" variant="dark" expand="md">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard/languages">
            Vocabulary Wave
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard/languages">
              Diller
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/my-account">
              Hesabım
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/my-info">
              Bilgilerim
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard/my-vocab">
              Kelime Haznem
            </Nav.Link>
            <Button variant="outline-danger" className="ms-3" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* İçerik alanı */}
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  )
}

export default Layout
