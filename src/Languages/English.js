import React from 'react';
import { Card, Button } from 'react-bootstrap';

function English() {
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="mb-4">İngilizce</Card.Title>
        <Button variant="primary" className="mb-2 w-100">
          Öğrenmeye Başla
        </Button>
        <Button variant="secondary" className="mb-2 w-100">
          Öğrendiklerim
        </Button>
        <Button variant="secondary" className="mb-2 w-100">
          Öğreneceklerim
        </Button>
        <Button variant="secondary" className="mb-2 w-100">
          Test Et
        </Button>
      </Card.Body>
    </Card>
  );
}

export default English;
