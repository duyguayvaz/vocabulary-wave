// Bu bileşen, kullanıcının kişisel bilgilerini görüntülemesini ve düzenlemesini sağlar.
import React, { useEffect, useState } from 'react';
import { Card, Alert, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function MyInfo() {
  // userInfo: kullanıcı bilgilerini tutmak için
  // error: hata mesajı
  // success: başarı mesajı
  // formData: güncellenen değerleri tutmak için
  // showForm: güncelleme formunu göster/gizle
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [showForm, setShowForm] = useState(false);

  // Bileşen yüklendiğinde kullanıcı bilgilerini çekiyoruz.
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Kullanıcı bilgilerini state'e kaydediyoruz.
        setUserInfo(response.data);
        // Formu doldurmak için ilk değerleri ayarlıyoruz.
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

  // Formdaki alanlar değişince formData'yı güncelliyoruz.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form gönderildiğinde güncelleme isteği atıyoruz.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Kullanıcı bilgilerini güncellemek için PUT isteği
      const response = await axios.put(
        `http://34.78.14.168:1337/api/users/${userInfo.id}`,
        {
          username: formData.username,
          email: formData.email,
        }
      );

      // Başarılı olursa kullanıcı bilgilerini güncelliyoruz.
      setUserInfo(response.data);
      setSuccess('User information updated successfully.');
      setShowForm(false);
    } catch (err) {
      setError('Failed to update user information.');
    }
  };

  // Kart içinde kullanıcı bilgilerinin gösterimi ve güncelleme formu
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
              style={{backgroundColor: '#647daf', border: 'none'}}
              onClick={() => setShowForm(!showForm)}
            >
              Bilgileri Güncelle
            </Button>
          </div>
        )}

        {/* Kullanıcı butona basarsa form görüntülenir. */}
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
              style={{backgroundColor: '#647daf', border: 'none'}}
            >
              Güncelle
            </Button>
          </Form>
        )}

        {/* Hata veya başarı mesajları */}
        {error && <Alert className="mt-3" variant="light">{error}</Alert>}
        {success && <Alert className="mt-3" variant="light">{success}</Alert>}
      </Card.Body>
    </Card>
  );
}

// Bu bileşeni dışa aktarıyoruz.
export default MyInfo;
