import React, { useEffect, useState } from 'react';
import { Card, Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function MyInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (err) {
        setError('Failed to fetch user information.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(
        `http://localhost:1337/api/users/${userInfo.id}`,
        {
          username: formData.username,
          email: formData.email,
        }
      );

      setUserInfo(response.data);
      setSuccess('User information updated successfully.');
      setShowForm(false);
    } catch (err) {
      setError('Failed to update user information.');
    }
  };

  return (
    <Card className="info-card">
      <Card.Body>
        <Card.Title className="title mb-4">Bilgilerim</Card.Title>
        {userInfo && (
          <div>
            <p><strong>Kullanıcı Adı:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <Button 
              variant="secondary" 
              className="mt-3"
              style={{backgroundColor: '#647daf',border: 'none'}} 
              onClick={() => setShowForm(!showForm)}
            >
              Bilgileri Güncelle
            </Button>
          </div>
        )}

        {showForm && (
          <Form onSubmit={handleSubmit} className="mt-4">
            <Form.Group controlId="username">
              <Form.Label>Kullanıcı Adı</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button  
            type="submit" 
            className="mt-3" 
            style={{backgroundColor: '#647daf',border: 'none'}}>
              Güncelle
            </Button>
          </Form>
        )}

        {error && <Alert className="mt-3" variant="light">{error}</Alert>}
        {success && <Alert className="mt-3" variant="light">{success}</Alert>}
      </Card.Body>
    </Card>
  );
}

export default MyInfo;