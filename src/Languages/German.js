import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function German() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/learn-german');
  };

  const handleListGerman=() =>{
    navigate('/list-german')
  }

  const handleWillLearn=()=>{
    navigate('/will-learn-german')
  }
  const handleQuizGerman =()=>{
    navigate('/quiz-german')
  }
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

export default German;
