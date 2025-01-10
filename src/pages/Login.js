// src/pages/Login.js
import React, { useState } from 'react'
import axios from 'axios'
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap'

function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      })
      localStorage.setItem('token', res.data.jwt)
      alert('Giriş başarılı!')
      window.location.href = '/dashboard/languages'
    } catch (err) {
      console.error(err)
      alert('Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.')
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Giriş Yap</Card.Title>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formIdentifier">
                  <Form.Label>E-posta veya Kullanıcı Adı</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E-posta veya Kullanıcı Adı"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Giriş Yap
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
