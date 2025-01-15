// Bu bileşen, kullanıcıya hangi dili seçmek istediğini gösteren bir menü kartı sunar.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Language() {
  // useNavigate hook'u ile sayfalar arası geçiş yapıyoruz.
  const navigate = useNavigate();

  // İngilizce seçildiğinde /language/english sayfasına yönlendirir.
  const handleEnglishClick = () => {
    navigate('/language/english');
  };

  // Almanca seçildiğinde /language/german sayfasına yönlendirir.
  const handleGermanClick = () => {
    navigate('/language/german');
  };

  // Fransızca seçildiğinde /language/french sayfasına yönlendirir.
  const handleFrenchClick = () => {
    navigate('/language/french');
  };

  // İspanyolca seçildiğinde /language/spanish sayfasına yönlendirir.
  const handleSpanishClick = () => {
    navigate('/language/spanish');
  };

  // Kart içinde dört dil seçeneği sunuyoruz. 
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">Diller</Card.Title>

        {/* İngilizce butonu */}
        <Button 
          className="button mb-3 w-100"
          onClick={handleEnglishClick}
        >
          İngilizce
        </Button>

        {/* Almanca butonu */}
        <Button
          className="button mb-3 w-100"
          onClick={handleGermanClick}
        >
          Almanca
        </Button>

        {/* Fransızca butonu */}
        <Button
          className="button mb-3 w-100"
          onClick={handleFrenchClick}
        >
          Fransızca
        </Button>

        {/* İspanyolca butonu */}
        <Button
          className="button mb-3 w-100"
          onClick={handleSpanishClick}
        >
          İspanyolca
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bu bileşeni dışa aktarıyoruz ki başka dosyalarda da kullanılabilsin.
export default Language;
