// Bu bileşen İngilizce için bir menü kartı oluşturuyor.
// useNavigate hook'u ile sayfalar arası yönlendirme yapacağız.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function English() {
  // Sayfalar arası geçiş yapmak için useNavigate'i kullanıyoruz.
  const navigate = useNavigate();

  // "Öğrenmeye Başla" butonu tıklandığında /learn-english sayfasına yönlendirme.
  const handleStartLearning = () => {
    navigate('/learn-english');
  };

  // "Öğrendiklerim" butonu tıklandığında /list-english sayfasına yönlendirme.
  const handleListEnglish = () => {
    navigate('/list-english');
  };

  // "Öğreneceklerim" butonu tıklandığında /will-learn-english sayfasına yönlendirme.
  const handleWillLearn = () => {
    navigate('/will-learn-english');
  };

  // "Test Et" butonu tıklandığında /quiz-english sayfasına yönlendirme.
  const handleQuizEnglish = () => {
    navigate('/quiz-english');
  };

  // Bir Card bileşeni içerisinde dört farklı buton gösteriyoruz.
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">İngilizce</Card.Title>
        <Button
          className="button mb-3 w-100"
          onClick={handleStartLearning}>
          Öğrenmeye Başla
        </Button>
        <Button
          className="button mb-3 w-100"
          onClick={handleListEnglish}>          
          Öğrendiklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleWillLearn}>
          Öğreneceklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleQuizEnglish}>
          Test Et
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bu bileşeni diğer dosyalarda da kullanabilmek için dışa aktarıyoruz.
export default English;
