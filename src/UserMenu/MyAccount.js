import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MyAccount() {

  const navigate = useNavigate();

  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="mb-4">Hesabım</Card.Title>
        <Button
          variant="primary"
          className="mb-2 w-100"
          onClick={() => navigate('/myaccount/info')}
        >
          Bilgilerim
        </Button>
        <Button variant="secondary" className="mb-2 w-100">
          Kelime Haznem
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MyAccount;
