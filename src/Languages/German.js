// Bu bileşen Almanca için bir menü kartı oluşturuyor.
// useNavigate hook'u ile sayfalar arası yönlendirme yapacağız.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function German() {
  // Sayfalar arası geçiş yapmak için useNavigate'i kullanıyoruz.
  const navigate = useNavigate();

  // "Öğrenmeye Başla" butonu tıklandığında /learn-german sayfasına yönlendirme.
  const handleStartLearning = () => {
    navigate('/learn-german');
  };

  // "Öğrendiklerim" butonu tıklandığında /list-german sayfasına yönlendirme.
  const handleListGerman = () => {
    navigate('/list-german');
  };

  // "Öğreneceklerim" butonu tıklandığında /will-learn-german sayfasına yönlendirme.
  const handleWillLearn = () => {
    navigate('/will-learn-german');
  };

  // "Test Et" butonu tıklandığında /quiz-german sayfasına yönlendirme.
  const handleQuizGerman = () => {
    navigate('/quiz-german');
  };

  // Bir Card bileşeni içerisinde dört farklı buton gösteriyoruz.
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">Almanca</Card.Title>
        <Button
          className="button mb-3 w-100"
          onClick={handleStartLearning}>
          Öğrenmeye Başla
        </Button>
        <Button
          className="button mb-3 w-100"
          onClick={handleListGerman}>          
          Öğrendiklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleWillLearn}>
          Öğreneceklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleQuizGerman}>
          Test Et
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bu bileşeni diğer dosyalarda da kullanabilmek için dışa aktarıyoruz.
export default German;
