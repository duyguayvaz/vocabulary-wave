import React from 'react';
import { Card, Button } from 'react-bootstrap';

function AdminMenu() {
  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="mb-4">Admin Menu</Card.Title>
        <Button variant="warning" className="mb-2 w-100">
          Manage Users
        </Button>
        <Button variant="danger" className="mb-2 w-100">
          Manage Vocabulary
        </Button>
        <Button variant="dark" className="w-100">
          View Reports
        </Button>
      </Card.Body>
    </Card>
  );
}

export default AdminMenu;
