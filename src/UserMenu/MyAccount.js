import React from 'react';
import { Card, Button } from 'react-bootstrap';

function MyAccount() {
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="mb-4">Hesabım</Card.Title>
        <Button variant="primary" className="mb-2 w-100">
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
