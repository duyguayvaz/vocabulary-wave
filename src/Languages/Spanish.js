import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Spanish() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/learn-spanish');
  };

  const handleListSpanish=() =>{
    navigate('/list-spanish')
  }

  const handleWillLearn=()=>{
    navigate('/will-learn-spanish')
  }
  const handleQuizSpanish =()=>{
    navigate('/quiz-spanish')
  }
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

export default Spanish;
