// Giriş işlemleri için gerekli kütüphaneleri import ediyoruz.
import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

// Login bileşenimizi tanımlıyoruz. 
// Kullanıcı bilgilerini ve admin olup olmadığını üst bileşenlere gönderebilmek için props üzerinden fonksiyonlar alıyoruz.
function Login({ setIsLoggedIn, setIsAdmin, setUser }) {
  // Kullanıcı adı/e-mail ve şifreyi saklamak için state değişkenlerini tanımlıyoruz.
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  // Hataları göstermek için ayrı bir state daha oluşturuyoruz.
  const [error, setError] = useState('');

  // Form gönderildiğinde çalışacak fonksiyon. 
  // Kullanıcı bilgileriyle API'ye istek atarak giriş yapmayı deniyoruz.
  const handleLogin = async (e) => {
    // Sayfa yenilenmesini engelliyoruz.
    e.preventDefault();
    setError('');
  
    try {
      // Giriş yapmak için API'ye POST isteği atıyoruz.
      const response = await axios.post('http://34.78.14.168:1337/api/auth/local', {
        identifier,
        password,
      });
  
      // Eğer istek başarılıysa JWT token'ı saklıyoruz.
      localStorage.setItem('jwt', response.data.jwt); 
      // Kullanıcının giriş yaptığını ve ismini üst bileşenlere bildiriyoruz.
      setIsLoggedIn(true);
      setUser(response.data.user.username);
      
      // Admin kontrolü için şart koyuyoruz.
      if (identifier === 'WVadmin' && password === 'WV1234admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      // Eğer hata alırsak kullanıcıya uyarı gösteriyoruz.
      setError('Giriş başarısız. Tekrar kontrol edin.');
    }
  };

  // Arayüzde kart içinde giriş formu ve hata mesajını gösteriyoruz.
  return (
    <Card className="auth-card">
      <Card.Body>
        <Card.Title className="title mb-4">Hoş Geldiniz</Card.Title>
        {/* Eğer bir hata varsa kullanıcıya gösteriyoruz */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Giriş formumuz */}
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

          {/* Giriş butonu */}
          <Button type="submit" className="button mb-2 w-100">
            Giriş Yap
          </Button>
        </Form>
        {/* Kayıt olmak isteyenler için link */}
        <div className="mt-3 text-center">
          <a href="/register">Kayıt olmak için buraya tıklayın</a>
        </div>
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz ki uygulamanın diğer kısımlarında kullanılabilsin.
export default Login;
