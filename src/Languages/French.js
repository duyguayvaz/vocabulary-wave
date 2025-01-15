// Bu bileşen Fransızca için bir menü kartı oluşturuyor.
// useNavigate hook'u ile sayfalar arası yönlendirme yapacağız.
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function French() {
  // Sayfalar arası geçiş yapmak için useNavigate'i kullanıyoruz.
  const navigate = useNavigate();

  // "Öğrenmeye Başla" butonu tıklandığında /learn-french sayfasına yönlendirme.
  const handleStartLearning = () => {
    navigate('/learn-french');
  };

  // "Öğrendiklerim" butonu tıklandığında /list-french sayfasına yönlendirme.
  const handleListFrench = () => {
    navigate('/list-french');
  };

  // "Öğreneceklerim" butonu tıklandığında /will-learn-french sayfasına yönlendirme.
  const handleWillLearn = () => {
    navigate('/will-learn-french');
  };

  // "Test Et" butonu tıklandığında /quiz-french sayfasına yönlendirme.
  const handleQuizFrench = () => {
    navigate('/quiz-french');
  };

  // Bir Card bileşeni içerisinde dört farklı buton gösteriyoruz.
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">Fransızca</Card.Title>
        <Button
          className="button mb-3 w-100"
          onClick={handleStartLearning}>
          Öğrenmeye Başla
        </Button>
        <Button
          className="button mb-3 w-100"
          onClick={handleListFrench}>          
          Öğrendiklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleWillLearn}>
          Öğreneceklerim
        </Button>
        <Button 
          className="button mb-3 w-100"
          onClick={handleQuizFrench}>
          Test Et
        </Button>
      </Card.Body>
    </Card>
  );
}

// Bu bileşeni diğer dosyalarda da kullanabilmek için dışa aktarıyoruz.
export default French;
