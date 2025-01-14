import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function English() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/learn-english');
  };

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
          className="button mb-3 w-100">
          Öğrendiklerim
        </Button>
        <Button 
          className="button mb-3 w-100">
          Öğreneceklerim
        </Button>
        <Button 
          className="button mb-3 w-100">
          Test Et
        </Button>
      </Card.Body>
    </Card>
  );
}

export default English;
