// Kullanıcı kaydı işlemleri için gerekli kütüphaneleri içe aktarıyoruz.
import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Kayıt olmak isteyen kullanıcının bilgilerini alarak veritabanına ekleyeceğimiz Register bileşeni.
function Register() {
  // Formdan gelecek kullanıcı bilgilerini tutmak için state’ler tanımlıyoruz.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Hata mesajını göstermek için ayrı bir state oluşturuyoruz.
  const [error, setError] = useState('');
  // Kayıt başarılı olduğunda kullanıcıyı yönlendirmek için useNavigate hook’unu kullanıyoruz.
  const navigate = useNavigate();

  // Form gönderildiğinde çalışacak fonksiyonumuz.
  const handleRegister = async (e) => {
    // Sayfanın yenilenmesini engelliyoruz.
    e.preventDefault();
    // Hata mesajını başlangıçta temizliyoruz.
    setError('');

    try {
      // Kullanıcının girdiği verileri API'ye göndererek yeni bir kullanıcı kaydı yapmaya çalışıyoruz.
      await axios.post('http://34.78.14.168:1337/api/auth/local/register', {
        username,  
        email,
        password,
      });
      // Kayıt başarılı olursa login sayfasına yönlendiriyoruz.
      navigate('/login');
    } catch (error) {
      // Eğer bir hata oluşursa burada kullanıcıya mesaj gösteriyoruz.
      setError('Kayıt başarısız oldu. Tekrar deneyin.');
    }
  };

  // Arayüzde kart şeklinde kayıt formunu gösteriyoruz.
  return (
    <Card className="auth-card">
      <Card.Body>
        <Card.Title className="title mb-4">Hoş Geldiniz</Card.Title>
        {/* Bir hata varsa Alert ile gösteriyoruz */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Kayıt formumuz */}
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Kullanıcı Adı</Form.Label>
            {/* Kullanıcının adını gireceği alan */}
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>E-mail</Form.Label>
            {/* Kullanıcının e-posta adresini gireceği alan */}
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Şifre</Form.Label>
            {/* Kullanıcının şifresini gireceği alan */}
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Kayıt Ol butonu */}
          <Button type="submit" className="button mb-2 w-100">
            Kayıt Ol
          </Button>
        </Form>

        {/* Halihazırda hesabı olanlar için giriş sayfasına yönlendirme linki */}
        <div className="mt-3 text-center">
          <a href="/login">Giriş yapmak için buraya tıklayın</a>
        </div>
      </Card.Body>
    </Card>
  );
}

// Bileşeni diğer dosyalarda kullanabilmek için dışa aktarıyoruz.
export default Register;
