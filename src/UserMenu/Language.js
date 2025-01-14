import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Language() {

    const navigate = useNavigate();
  
    const handleEnglishClick = () => {
      navigate('/language/english');
    };

    const handleGermanClick = () => {
      navigate('/language/german');
    };

    const handleFrenchClick = () => {
      navigate('/language/french');
    };

    const handleSpanishClick = () => {
      navigate('/language/spanish');
    };

  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">
          Diller
          </Card.Title>
        <Button 
                className="button mb-3 w-100"
                onClick={handleEnglishClick}>
          İngilizce
        </Button>
        <Button  
                className="button mb-3 w-100"
                onClick={handleGermanClick}>
          Almanca
        </Button>
        <Button  
                className="button mb-3 w-100"
                onClick={handleFrenchClick}>
          Fransızca
        </Button>
        <Button  
                className="button mb-3 w-100"
                onClick={handleSpanishClick}>
          İspanyolca
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Language;
