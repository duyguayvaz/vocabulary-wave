import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MainMenu() {
  const navigate = useNavigate();

  const handleLanguageClick = () => {
    navigate('/language');
  };

  const handleMyAccountClick = () => {
    navigate('/myaccount');
  };

  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-5">Ana Menü</Card.Title>

        <Button 
          className="button mb-3 w-100"
          onClick={handleLanguageClick}
        >
          Diller
        </Button>
        <Button
          className="button mb-3 w-100"
          onClick={handleMyAccountClick}
        >
          Hesabım
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MainMenu;
