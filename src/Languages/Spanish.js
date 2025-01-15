// Bu bileşen İspanyolca için bir menü kartı oluşturuyor.
// useNavigate hook'u ile sayfalar arası yönlendirme yapacağız.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Spanish() {
  // Sayfalar arası geçiş yapmak için useNavigate'i kullanıyoruz.
  const navigate = useNavigate();

  // "Öğrenmeye Başla" butonu tıklandığında /learn-spanish sayfasına yönlendirme.
  const handleStartLearning = () => {
    navigate('/learn-spanish');
  };

  // "Öğrendiklerim" butonu tıklandığında /list-spanish sayfasına yönlendirme.
  const handleListSpanish = () => {
    navigate('/list-spanish');
  };

  // "Öğreneceklerim" butonu tıklandığında /will-learn-spanish sayfasına yönlendirme.
  const handleWillLearn = () => {
    navigate('/will-learn-spanish');
  };

  // "Test Et" butonu tıklandığında /quiz-spanish sayfasına yönlendirme.
  const handleQuizSpanish = () => {
    navigate('/quiz-spanish');
  };

  // Bir Card bileşeni içerisinde dört farklı buton gösteriyoruz.
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">İspanyolca</Card.Title>
        <Button
          className="button mb-3 w-100"
          onClick={handleStartLearning}>
          Öğrenmeye Başla
        </Button>
        <Button
          className="button mb-3 w-100"
          onClick={handleListSpanish}>          
          Öğrendiklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleWillLearn}>
          Öğreneceklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleQuizSpanish}>
          Test Et
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bu bileşeni diğer dosyalarda da kullanabilmek için dışa aktarıyoruz.
export default Spanish;
