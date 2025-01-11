import React, { useEffect, useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import axios from 'axios';

function MyInfo({ user }) {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('jwt'); // Eğer token localStorage'da saklanıyorsa, buradan alınır
        const response = await axios.get('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo(response.data);
      } catch (err) {
        setError('Failed to fetch user information.');
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Card className="info-card">
      <Card.Body>
        <Card.Title className="mb-4">Bilgilerim</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {userInfo ? (
          <div>
            <p><strong>Kullanıcı Adı:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default MyInfo;
