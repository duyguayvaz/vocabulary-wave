// Bu bileşen, kullanıcının hesap bilgileri menüsünü gösterir.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MyAccount() {
  // useNavigate hook'u ile sayfalar arası geçiş yapıyoruz.
  const navigate = useNavigate();

  // Kart içerisinde "Bilgilerim" ve "Kelime Haznem" sayfalarına yönlendiren butonlar var.
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">Hesabım</Card.Title>

        {/* Kullanıcının bilgilerini göreceği sayfaya yönlendiriyor */}
        <Button
          className="button mb-3 w-100"
          onClick={() => navigate('/myaccount/info')}
        >
          Bilgilerim
        </Button>

        {/* Kelime Haznesi sayfasına yönlendiriyor */}
        <Button
          className="button mb-3 w-100"
          onClick={() => navigate('/my-vocabularys')}
        >
          Kelime Haznem
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz.
export default MyAccount;
