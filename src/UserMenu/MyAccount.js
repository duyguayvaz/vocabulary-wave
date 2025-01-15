import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MyAccount() {

  const navigate = useNavigate();

  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title 
        className="title mb-4">
          Hesabım
          </Card.Title>
        <Button
          className="button mb-3 w-100"
          onClick={() => navigate('/myaccount/info')}
        >
          Bilgilerim
        </Button>
        <Button 
            className="button mb-3 w-100" onClick={()=> navigate('/my-vocabularys')}>
          Kelime Haznem
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MyAccount;
