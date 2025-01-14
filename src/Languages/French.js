import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function French() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/learn-french');
  };

  const handleListFrench=() =>{
    navigate('/list-french')
  }

  const handleWillLearn=()=>{
    navigate('/will-learn-french')
  }
  const handleQuizFrench =()=>{
    navigate('/quiz-french')
  }
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

export default French;
