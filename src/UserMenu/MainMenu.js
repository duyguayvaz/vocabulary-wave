// MainMenu.js

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
        <Card.Title className="mb-4">Main Menu</Card.Title>
        <Button
          variant="primary"
          className="mb-2 w-100"
          onClick={handleLanguageClick}
        >
          Diller
        </Button>
        <Button variant="secondary" 
        className="mb-2 w-100"
        onClick={handleMyAccountClick}>
          Hesabım
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MainMenu;
