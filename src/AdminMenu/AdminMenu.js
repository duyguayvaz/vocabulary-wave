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
        <Card.Title className="title mb-4">Admin Menü</Card.Title>
        <Button
          className="button mb-3 w-100"
          onClick={handleAddWord}
        >
          Kelime Ekle
        </Button>
        <Button 
          className="button mb-3 w-100" 
          onClick={handleupdateWord}>
          Kelime Güncelle
        </Button>
        <Button  
          className="button mb-3 w-100"
          onClick={handleDeleteWord}>
          Kelime Sil
        </Button>
      </Card.Body>
    </Card>
  );
}

export default AdminMenu;
