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
        <Card.Title className="mb-4">Login to Vocabulary Wave</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formIdentifier">
            <Form.Label>Email or Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <a href="/register">Don't have an account? Register here</a>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Login;
