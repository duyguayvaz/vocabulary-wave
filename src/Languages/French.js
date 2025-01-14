import React from 'react';
import { Card, Button } from 'react-bootstrap';

function French() {
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="title mb-4">Fransızca</Card.Title>
        <Button
          className="button mb-3 w-100">
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

export default French;
