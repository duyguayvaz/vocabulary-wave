import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsLoggedIn, setIsAdmin, setUser }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier,
        password,
      });
  
      localStorage.setItem('jwt', response.data.jwt); 
      setIsLoggedIn(true);
      setUser(response.data.user.username);
      
      if (identifier === 'admin' && password === '1234') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setError('Login failed. Check email or password.');
    }
  };
  
  

  return (
    <Card className="auth-card">
      <Card.Body>
        <Card.Title className="title mb-4">Hoş Geldiniz</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formIdentifier">
            <Form.Label>Kullanıcı adı veya e-mail</Form.Label>
            <Form.Control
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="button mb-2 w-100">
            Giriş Yap
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <a href="/register">Kayıt olmak için buraya tıklayın</a>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Login;
