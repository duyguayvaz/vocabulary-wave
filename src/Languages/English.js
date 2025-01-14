import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function English() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/learn-english');
  };

  const handleListEnglish=() =>{
    navigate('/list-english')
  }

  const handleWillLearn=()=>{
    navigate('/will-learn-english')
  }
  const handleQuizEnglish =()=>{
    navigate('/quiz-english')
  }
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

export default English;
