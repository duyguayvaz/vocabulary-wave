// Bu bileşen, uygulamanın ana menüsünü oluşturur ve kullanıcıya seçenekler sunar.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MainMenu() {
  // useNavigate ile sayfalar arası yönlendirme yapabiliriz.
  const navigate = useNavigate();

  // "Diller" butonuna basılınca /language sayfasına yönlendiriyoruz.
  const handleLanguageClick = () => {
    navigate('/language');
  };

  // "Hesabım" butonuna basılınca /myaccount sayfasına yönlendiriyoruz.
  const handleMyAccountClick = () => {
    navigate('/myaccount');
  };

  // Kart içinde iki butonla ana menüyü gösteriyoruz.
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">Ana Menü</Card.Title>

        <Button
          className="button mb-3 w-100"
          onClick={handleLanguageClick}
        >
          Diller
        </Button>
        <Button
          className="button mb-3 w-100"
          onClick={handleMyAccountClick}
        >
          Hesabım
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz.
export default MainMenu;
