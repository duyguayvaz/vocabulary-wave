import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminMenu() {
  const navigate = useNavigate();

  const handleAddWord = () => {
    navigate('/add-word');
  };

  const handleupdateWord =()=>{
    navigate('/update-word')
  }

  const handleDeleteWord=()=>{
    navigate('/delete-word')
  }

  return (
    <Card className="menu-card">
      <Card.Body>
        <Card.Title className="mb-4">Admin Menu</Card.Title>
        <Button
          variant="warning"
          className="mb-2 w-100"
          onClick={handleAddWord}
        >
          Kelime Ekle
        </Button>
        <Button variant="danger" 
                className="mb-2 w-100" 
                onClick={handleupdateWord}>
          Kelime Güncelle
        </Button>
        <Button variant="dark" 
                className="mb-2 w-100"
                onClick={handleDeleteWord}>
          Kelime Sil
        </Button>
        <Button variant="dark" className="w-100">
          Satın Alma İşlemleri
        </Button>
      </Card.Body>
    </Card>
  );
}

export default AdminMenu;
